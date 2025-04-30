import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import * as bcrypt from "bcryptjs";
import { ClsService } from "nestjs-cls";
import { Strategy } from "passport-local";

import { CLS_KEYS } from "@/common/constants/cls.constants";
import { generateJWT } from "@/common/utils";
import { AuthRepository } from "@/modules/auth/auth.repository";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly cls: ClsService,
  ) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {
    const account = await this.authRepository.getAccountById(`email_${email}`);
    if (!account) throw new NotFoundException("CUSTOMER_NOT_FOUND");

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

      const token = await generateJWT({
        expirationTime: this.configService.get<string>(
          "jwt.expiresIn.accessToken",
        )!,
        payload: {
          sub: account.id,
          user: account.customer,
        },
        secret: this.configService.get<string>("jwt.secret.accessToken"),
      });

      this.cls.set(CLS_KEYS.ACCESS_TOKEN, token);

      return account;
    }
    throw new UnauthorizedException("INVALID_CREDENTIALS");
  }
}
