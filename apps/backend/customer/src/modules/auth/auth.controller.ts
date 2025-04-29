import { BadRequestException, Controller, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { customerContract } from "customer_api";

import { LocalAuthGuard } from "@/common/guards/local_auth.guard";

import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {}

  @TsRestHandler(customerContract.auth.loginGoogle)
  async loginGoogle() {
    return tsRestHandler(
      customerContract.auth.loginGoogle,
      async ({ body }) => {
        // TODO: move logic to guard
        const googleAccount = await this.authRepository.getAccountById(
          `google_${body.sub}`,
        );
        if (!googleAccount || !googleAccount.customer) {
          throw new BadRequestException();
        }
        if (googleAccount.status !== "active") {
          throw new BadRequestException();
        }
        const token = await this.authService.generateJWT({
          expirationTime: this.configService.get<string>("jwt.expiresIn")!,
          payload: {
            sub: googleAccount.customer.id,
            user: googleAccount.customer,
          },
          secret: this.configService.get<string>("jwt.secret.accessToken")!,
        });

        return {
          status: 201,
          body: { token },
        };
      },
    );
  }

  @UseGuards(LocalAuthGuard)
  @TsRestHandler(customerContract.auth.loginCredentials)
  async loginCredentials() {
    return tsRestHandler(
      customerContract.auth.loginCredentials,
      async ({ body }) => {
        const userAccount = await this.authRepository.getAccountById(
          `email_${body.email}`,
        );
        if (!userAccount) {
          throw new BadRequestException();
        }
        if (userAccount.status !== "active") {
          throw new BadRequestException();
        }

        const token = await this.authService.generateJWT({
          expirationTime: this.configService.get<string>(
            "jwt.expiresIn.accessToken",
          )!,
          payload: {
            sub: userAccount.id,
            user: userAccount.customer,
          },
          secret: this.configService.get<string>("jwt.secret.accessToken"),
        });

        return {
          status: 201,
          body: { token },
        };
      },
    );
  }

  @TsRestHandler(customerContract.auth.registerGoogle)
  async registerGoogle() {
    return tsRestHandler(
      customerContract.auth.registerGoogle,
      async ({ body }) => {
        const createdUser = await this.authService.registerGoogle(body);

        const token = await this.authService.generateJWT({
          expirationTime: this.configService.get<string>("jwt.expiresIn")!,
          payload: {
            sub: createdUser.id,
            user: createdUser,
          },
          secret: this.configService.get<string>("jwt.secret.accessToken")!,
        });
        return {
          status: 201,
          body: { token },
        };
      },
    );
  }

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

  // @UseGuards(AccountStatusJwtAuthGuard)
  // @TsRestHandler(fureverHomeContract.auth.createProfile)
  // async createProfile(@RequestUser() account: UserJoinedUserKey) {
  //   return tsRestHandler(
  //     fureverHomeContract.auth.createProfile,
  //     async ({ body }) => {
  //       const userKeyId = account.id;
  //       await this.authService.createProfile(body, userKeyId);

  //       return {
  //         status: 201,
  //         body: {},
  //       };
  //     },
  //   );
  // }

  // @TsRestHandler(fureverHomeContract.auth.verifyAccount)
  // async verifyAccount() {
  //   return tsRestHandler(
  //     fureverHomeContract.auth.verifyAccount,
  //     async ({ body }) => {
  //       await this.authService.verifyAccount(body);

  //       return {
  //         status: 200,
  //         body: {},
  //       };
  //     },
  //   );
  // }

  // @UseGuards(JwtAuthGuard)
  // @TsRestHandler(fureverHomeContract.auth.getProfile)
  // async getProfile(@RequestUser() account: UserJoinedUserKey) {
  //   return tsRestHandler(fureverHomeContract.auth.getProfile, async () => {
  //     const profile = await this.authService.getProfile(account.id);

  //     return {
  //       status: 200,
  //       body: profile,
  //     };
  //   });
  // }
}
