import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// import { CustomerStatusEnum } from "common_api";
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
export class PasswordResetJwtStrategy extends PassportStrategy(
  Strategy,
  'password_reset_jwt_strategy',
) {
  constructor(
    // private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly cls: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret.passwordReset')!,
    });
  }

  async validate(payload: JWTPayload) {
    // const account = await this.authRepository.getAccountById(payload.sub);
    // if (!account) throw new UnauthorizedException("SESSION_EXPIRED");
    // if (account.status !== CustomerStatusEnum.enum.active.toString()) {
    //   throw new ForbiddenException("NOT_ACTIVE_ACCOUNT");
    // }
    // this.cls.set(CLS_KEYS.CUSTOMER_ACCOUNT, account);
    // return account;
  }
}
