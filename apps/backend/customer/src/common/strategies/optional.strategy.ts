import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CLS_KEYS } from '@/common/constants/cls.constants';
// import { AuthRepository } from "@/modules/auth/auth.repository";

type JWTPayload = {
  exp: number;
  iat: number;
  sub: string;
};

@Injectable()
export class OptionalStrategy extends PassportStrategy(Strategy, 'optional') {
  constructor(
    // private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly cls: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret.accessToken')!,
    });
  }

  async validate(payload: JWTPayload) {
    // const account = await this.authRepository.getAccountById(payload.sub);
    // if (account) {
    //   this.cls.set(CLS_KEYS.CUSTOMER_ACCOUNT, account);
    //   this.cls.set(CLS_KEYS.CUSTOMER_PROFILE, account.customer);
    //   return account;
    // }
    // return null;
  }
}
