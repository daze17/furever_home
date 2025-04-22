import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class DevalueInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();
    const devalueHeader = request.headers["x-devalue"];

    // TODO: test big size json data
    if (devalueHeader === "true") {
      const devalue = await import("devalue");
      return next.handle().pipe(
        map((data) => {
          response.header("x-devalue", "true");
          const body = devalue.stringify(data);

          return body;
        }),
      );
    }
    return next.handle();
  }
}
