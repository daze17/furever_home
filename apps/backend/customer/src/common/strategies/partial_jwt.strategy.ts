import {
  ForbiddenException,
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
export class PartialJwtStrategy extends PassportStrategy(
  Strategy,
  "partial-jwt",
) {
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
    // NOTE: Unlike JwtStrategy, we allow null customer profiles
    // This is used for the profile creation endpoint where users have
    // verified accounts but haven't created their profile yet
    const { customer, ...account } = accountWithCustomer;
    this.cls.set(CLS_KEYS.CUSTOMER_ACCOUNT, account);
    if (customer) {
      this.cls.set(CLS_KEYS.CUSTOMER_PROFILE, customer);
    }
    return account;
  }
}
