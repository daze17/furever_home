import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CLS_KEYS } from '@/common/constants/cls.constants';
// import { AuthRepository } from "@/modules/auth/auth.repository";
// import { CustomerStatusEnum } from "common_api";

type JWTPayload = {
  exp: number;
  iat: number;
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly cls: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: configService.get<string>('jwt.secret.accessToken')!,
      secretOrKey: 'sercter',
    });
  }

  async validate(payload: JWTPayload) {
    // const accountWithCustomer = await this.authRepository.getAccountById(
    //   payload.sub,
    // );
    // if (!accountWithCustomer)
    //   throw new UnauthorizedException("SESSION_EXPIRED");
    // if (
    //   accountWithCustomer.status === CustomerStatusEnum.enum.inactive.toString()
    // ) {
    //   throw new ForbiddenException("INACTIVE_ACCOUNT");
    // }
    // if (
    //   accountWithCustomer.status ===
    //   CustomerStatusEnum.enum.pending_verify.toString()
    // ) {
    //   throw new ForbiddenException("WAITING_VERIFICATION");
    // }
    // if (!accountWithCustomer.customer) {
    //   throw new ForbiddenException("PROFILE_DOES_NOT_EXIST");
    // }
    // const { customer, ...account } = accountWithCustomer;
    // const { customer_setting, ...restCustomer } = customer;
    // this.cls.set(CLS_KEYS.CUSTOMER_ACCOUNT, account);
    // this.cls.set(CLS_KEYS.CUSTOMER_PROFILE, restCustomer);
    // this.cls.set(CLS_KEYS.CUSTOMER_SETTINGS, customer.customer_setting);
    // return account;
  }
}
