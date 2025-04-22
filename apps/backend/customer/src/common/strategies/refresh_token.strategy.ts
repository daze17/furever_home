import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { Strategy } from 'passport-jwt';

import { CLS_KEYS } from '@/common/constants/cls.constants';
// import { AuthRepository } from "@/modules/auth/auth.repository";

type JWTPayload = {
  exp: number;
  status: string;
  iat: number;
  sub: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    // private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly cls: ClsService,
  ) {
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('jwt.secret.refreshToken')!,
      ignoreExpiration: false,
    };
    super(options);
  }

  async validate(payload: JWTPayload) {
    // try {
    //   const account = await this.authRepository.getAccountById(payload.sub);
    //   if (!account) throw new UnauthorizedException("SESSION_EXPIRED");
    //   this.cls.set(CLS_KEYS.CUSTOMER_ACCOUNT, account);
    //   this.cls.set(CLS_KEYS.CUSTOMER_PROFILE, account.customer);
    //   return account;
    // } catch (error) {
    //   throw new UnauthorizedException("INVALID_REFRESH_TOKEN");
    // }
  }
}
