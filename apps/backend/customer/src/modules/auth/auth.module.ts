import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthGuard } from '@/common/guards/jwt_auth.guard';
// import { GoogleStrategy } from '@/common/strategies/google_oauth.strategy';
import { JwtStrategy } from '@/common/strategies/jwt.strategy';
import { LocalStrategy } from '@/common/strategies/local.strategy';
import { configuration } from '@/common/config/configuration';

import { EmailQueueModule } from '../email_queue/email_queue.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => EmailQueueModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret.accessToken'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn.accessToken'),
        },
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    // GoogleStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
