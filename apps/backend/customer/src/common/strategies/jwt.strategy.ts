import {
  ForbiddenException,
  ImATeapotException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { CustomerStatusEnum } from "common_api";
import { ClsService } from "nestjs-cls";
import { ExtractJwt, Strategy } from "passport-jwt";

import { CLS_KEYS } from "@/common/constants/cls.constants";
import { AuthRepository } from "@/modules/auth/auth.repository";

type JWTPayload = {
  exp: number;
  iat: number;
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly cls: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("jwt.secret.accessToken")!,
    });
  }

  async validate(payload: JWTPayload) {
    const accountWithCustomer = await this.authRepository.getAccountById(
      payload.sub,
    );
    if (!accountWithCustomer)
      throw new UnauthorizedException("SESSION_EXPIRED");
    if (accountWithCustomer.status === CustomerStatusEnum.inactive) {
      throw new ForbiddenException("INACTIVE_ACCOUNT");
    }
    if (accountWithCustomer.status === CustomerStatusEnum.pending) {
      throw new ForbiddenException("WAITING_VERIFICATION");
    }
    if (!accountWithCustomer.customer) {
      throw new ImATeapotException("PROFILE_DOES_NOT_EXIST");
    }
    const { customer, ...account } = accountWithCustomer;
    this.cls.set(CLS_KEYS.CUSTOMER_ACCOUNT, account);
    this.cls.set(CLS_KEYS.CUSTOMER_PROFILE, customer);

    // Populate customer settings in CLS for easy access across the app
    if (customer.customer_settings) {
      this.cls.set(CLS_KEYS.CUSTOMER_SETTINGS, customer.customer_settings);
    }

    return account;
  }
}
