import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { configuration } from "@/common/config/configuration";
import { EmailRateLimitGuard } from "@/common/guards/email_rate_limit.guard";
import { JwtAuthGuard } from "@/common/guards/jwt_auth.guard";
// import { GoogleStrategy } from '@/common/strategies/google_oauth.strategy';
import { JwtStrategy } from "@/common/strategies/jwt.strategy";
import { LocalStrategy } from "@/common/strategies/local.strategy";
import { PasswordResetJwtStrategy } from "@/common/strategies/password_reset_jwt_auth.strategy";
import { RefreshTokenStrategy } from "@/common/strategies/refresh_token.strategy";
import { CustomerModule } from "@/modules/customer/customer.module";
import { EmailQueueModule } from "@/modules/email_queue/email_queue.module";

import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    CustomerModule,
    forwardRef(() => EmailQueueModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret.accessToken"),
        signOptions: {
          expiresIn: configService.get<string>("jwt.expiresIn.accessToken"),
        },
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthRepository],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    JwtAuthGuard,
    EmailRateLimitGuard,
    // GoogleStrategy,
    LocalStrategy,
    PasswordResetJwtStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
