import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import Redis from "ioredis";

import { EMAIL_RATE_LIMIT_KEY } from "@/common/decorators/email_rate_limit.decorator";

@Injectable()
export class EmailRateLimitGuard implements CanActivate {
  private redis: Redis;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get<string>("redis.host"),
      port: this.configService.get<number>("redis.port"),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ttl = this.reflector.getAllAndOverride<number>(EMAIL_RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!ttl) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const body = request.body as { email?: string };

    if (!body?.email) {
      return true;
    }

    const key = `rate_limit:email:${body.email}`;
    const exists = await this.redis.exists(key);

    if (exists) {
      const ttlRemaining = await this.redis.ttl(key);
      throw new HttpException(
        {
          message: "TOO_MANY_REQUESTS",
          retry_after: ttlRemaining,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.redis.setex(key, ttl, "1");

    return true;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
