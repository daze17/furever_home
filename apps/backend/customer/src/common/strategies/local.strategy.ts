import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as bcrypt from "bcryptjs";
import { ClsService } from "nestjs-cls";
import { Strategy } from "passport-local";

import { CLS_KEYS } from "@/common/constants/cls.constants";
import { AuthRepository } from "@/modules/auth/auth.repository";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly cls: ClsService,
  ) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {
    const account = await this.authRepository.getAccountByEmail(email);
    if (!account) throw new NotFoundException("User not found");

    const slicedHash = account.hash.split("***").find(Boolean);
    const isCorrectPassword = await bcrypt.compare(password, slicedHash ?? "");

    if (account && isCorrectPassword) {
      // if (account.status === CustomerStatusEnum.enum.inactive.toString()) {
      if (account.status === "inactive") {
        throw new ForbiddenException("INACTIVE_ACCOUNT");
      }
      if (account.status === "pending") {
        throw new ForbiddenException("WAITING_VERIFICATION");
      }
      this.cls.set(CLS_KEYS.CUSTOMER_ACCOUNT, account);
      // this.cls.set(CLS_KEYS.CUSTOMER_PROFILE, account.);
      return account;
    }
    throw new UnauthorizedException("INVALID_CREDENTIALS");
  }
}
