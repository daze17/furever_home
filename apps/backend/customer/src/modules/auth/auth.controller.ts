import { BadRequestException, Controller, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { customerContract } from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";
import { EmailRateLimit } from "@/common/decorators/email_rate_limit.decorator";
import { Public } from "@/common/decorators/public";
import { EmailRateLimitGuard } from "@/common/guards/email_rate_limit.guard";
import { JwtAuthGuard } from "@/common/guards/jwt_auth.guard";
import { LocalAuthGuard } from "@/common/guards/local_auth.guard";
import { PartialJwtAuthGuard } from "@/common/guards/partial_jwt_auth.guard";
import { PasswordResetJwtAuthGuard } from "@/common/guards/password_reset_jwt_auth.guard";
import { RefreshTokenGuard } from "@/common/guards/refresh_token.guard";
import { generateJWT } from "@/common/utils";

import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly cls: ClsService,
  ) {}

  @Public()
  @TsRestHandler(customerContract.auth.loginGoogle)
  async loginGoogle() {
    return tsRestHandler(
      customerContract.auth.loginGoogle,
      async ({ body }) => {
        // TODO: move logic to guard

        const googleAccount = await this.authRepository.getAccountByEmail(
          `google_${body.sub}`,
        );
        if (!googleAccount || !googleAccount.customer) {
          throw new BadRequestException();
        }
        if (googleAccount.status !== "active") {
          throw new BadRequestException();
        }
        const accessToken = await generateJWT({
          expirationTime: this.configService.get<string>(
            "jwt.expiresIn.accessToken",
          )!,
          payload: {
            sub: googleAccount.id,
            user: googleAccount.customer,
          },
          secret: this.configService.get<string>("jwt.secret.accessToken")!,
        });

        const refreshToken = await generateJWT({
          expirationTime: this.configService.get<string>(
            "jwt.expiresIn.refreshToken",
          )!,
          payload: {
            sub: googleAccount.id,
            user: null,
          },
          secret: this.configService.get<string>("jwt.secret.refreshToken")!,
        });

        return {
          status: 201,
          body: { accessToken, refreshToken },
        };
      },
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @TsRestHandler(customerContract.auth.loginCredentials)
  async loginCredentials() {
    return tsRestHandler(customerContract.auth.loginCredentials, async () => {
      const accessToken = this.cls.get(CLS_KEYS.ACCESS_TOKEN);
      const refreshToken = this.cls.get(CLS_KEYS.REFRESH_TOKEN);

      return {
        status: 201,
        body: { accessToken, refreshToken },
      };
    });
  }

  @Public()
  @TsRestHandler(customerContract.auth.registerGoogle)
  async registerGoogle() {
    return tsRestHandler(
      customerContract.auth.registerGoogle,
      async ({ body }) => {
        const createdUser = await this.authService.registerGoogle(body);

        const accessToken = await generateJWT({
          expirationTime: this.configService.get<string>(
            "jwt.expiresIn.accessToken",
          )!,
          payload: {
            sub: `google_${body.sub}`,
            user: createdUser,
          },
          secret: this.configService.get<string>("jwt.secret.accessToken")!,
        });

        const refreshToken = await generateJWT({
          expirationTime: this.configService.get<string>(
            "jwt.expiresIn.refreshToken",
          )!,
          payload: {
            sub: `google_${body.sub}`,
            user: null,
          },
          secret: this.configService.get<string>("jwt.secret.refreshToken")!,
        });

        return {
          status: 201,
          body: { accessToken, refreshToken },
        };
      },
    );
  }

  @Public()
  @UseGuards(EmailRateLimitGuard)
  @EmailRateLimit(60)
  @TsRestHandler(customerContract.auth.registerCredentials)
  async registerCredentials() {
    return tsRestHandler(
      customerContract.auth.registerCredentials,
      async ({ body }) => {
        await this.authService.registerCredentials(body);
        return {
          status: 201,
          body: {},
        };
      },
    );
  }

  @Public()
  @TsRestHandler(customerContract.auth.verifyAccount)
  async verifyAccount() {
    return tsRestHandler(
      customerContract.auth.verifyAccount,
      async ({ body }) => {
        const tokens = await this.authService.verifyAccount(body);

        return {
          status: 200,
          body: tokens,
        };
      },
    );
  }

  @TsRestHandler(customerContract.auth.forgotPassword)
  async forgotPassword() {
    return tsRestHandler(
      customerContract.auth.forgotPassword,
      async ({ body }) => {
        await this.authService.forgotPassword(body);

        return {
          status: 201,
          body: {},
        };
      },
    );
  }

  @UseGuards(PasswordResetJwtAuthGuard)
  @TsRestHandler(customerContract.auth.resetPassword)
  async resetPassword() {
    return tsRestHandler(
      customerContract.auth.resetPassword,
      async ({ body }) => {
        const account = this.cls.get(CLS_KEYS.CUSTOMER_ACCOUNT);
        await this.authService.resetPassword(account.id, body);

        return {
          status: 201,
          body: {},
        };
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @TsRestHandler(customerContract.auth.changePassword)
  async changePassword() {
    return tsRestHandler(
      customerContract.auth.changePassword,
      async ({ body }) => {
        const account = this.cls.get(CLS_KEYS.CUSTOMER_ACCOUNT);
        await this.authService.changePassword(account.id, body);

        return {
          status: 200,
          body: {},
        };
      },
    );
  }

  @UseGuards(RefreshTokenGuard)
  @TsRestHandler(customerContract.auth.refreshToken)
  async refreshToken() {
    return tsRestHandler(customerContract.auth.refreshToken, async () => {
      const account = this.cls.get(CLS_KEYS.CUSTOMER_ACCOUNT);
      const accessToken = await this.authService.refreshAccessToken(account.id);

      // Generate new refresh token for token rotation
      const refreshToken = await generateJWT({
        expirationTime: this.configService.get<string>(
          "jwt.expiresIn.refreshToken",
        )!,
        payload: {
          sub: account.id,
          user: null,
        },
        secret: this.configService.get<string>("jwt.secret.refreshToken")!,
      });

      return {
        status: 201,
        body: { accessToken, refreshToken },
      };
    });
  }
}
