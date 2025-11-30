import { InjectQueue } from "@nestjs/bullmq";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { Queue } from "bullmq";
import {
  ChangePasswordRequestBody,
  CreateCustomerProfileRequestBody,
  ForgotPasswordRequestBody,
  RegisterGoogleRequestBody,
  RegisterWithEmailRequestBody,
  ResetPasswordRequestBody,
  VerifyAccountRequestBody,
} from "customer_api";

import {
  EMAIL_PROCESS_NAMES,
  QUEUE_PROCESSOR_NAMES,
} from "@/common/constants/queue.constants";
import { RegisterVerificationEmailToCustomer } from "@/common/interfaces/email.interface";
import { generateJWT } from "@/common/utils";
import { CustomerRepository } from "@/modules/customer/customer.repository";

import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue(QUEUE_PROCESSOR_NAMES.EMAIL_PROCESSOR)
    private readonly emailQueue: Queue,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async registerGoogle(body: RegisterGoogleRequestBody) {
    const response = await this.authRepository.createCustomerWithGoogle(body);
    return response;
  }

  async registerCredentials(body: RegisterWithEmailRequestBody) {
    const existingCustomerAccount = await this.authRepository.getAccountByEmail(
      body.email,
    );

    if (existingCustomerAccount) {
      const { status } = existingCustomerAccount;
      switch (status) {
        case "inactive":
          throw new BadRequestException("ACCOUNT_IS_INACTIVE");
        case "active":
          throw new ConflictException("ACCOUNT_ALREADY_EXISTS");
        case "pending":
          await this.sendVerificationEmail(
            existingCustomerAccount.id,
            body.email,
          );
          return;
      }
    }

    const customerAccountId =
      await this.authRepository.createCustomerAccountByCredential(body);
    await this.sendVerificationEmail(customerAccountId, body.email);
  }

  async verifyAccount(body: VerifyAccountRequestBody) {
    // Extract token, password, and profile data
    const { token, newPassword, ...profileData } = body;

    // 1. Verify JWT token
    const payload = await this.jwtService
      .verifyAsync<{ sub: string }>(token, {
        secret: this.configService.get<string>("jwt.secret.emailVerification"),
      })
      .then((payload) => payload)
      .catch((error) => {
        if (error instanceof Error) {
          console.log(error, "error");
        }
        return null;
      });

    if (!payload) {
      throw new BadRequestException("INVALID_TOKEN");
    }

    // 2. Get account
    const account = await this.authRepository.getAccountById(payload.sub);

    if (!account) {
      throw new BadRequestException("INVALID_TOKEN");
    }

    // Check if account already has profile
    if (account.customer_id) {
      throw new BadRequestException("ACCOUNT_ALREADY_VERIFIED");
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // 4. Complete registration atomically (profile + password + activate)
    const completedAccount = await this.authRepository.completeRegistration(
      account.id,
      hash,
      profileData as CreateCustomerProfileRequestBody,
    );

    // 5. Generate JWT tokens for auto-login
    const accessToken = await generateJWT({
      expirationTime: this.configService.get<string>(
        "jwt.expiresIn.accessToken",
      )!,
      payload: {
        sub: completedAccount.id,
        user: completedAccount.customer,
      },
      secret: this.configService.get<string>("jwt.secret.accessToken")!,
    });

    const refreshToken = await generateJWT({
      expirationTime: this.configService.get<string>(
        "jwt.expiresIn.refreshToken",
      )!,
      payload: {
        sub: completedAccount.id,
        user: null,
      },
      secret: this.configService.get<string>("jwt.secret.refreshToken")!,
    });

    return { accessToken, refreshToken };
  }

  async forgotPassword(body: ForgotPasswordRequestBody) {
    const account = await this.authRepository.getAccountByEmail(body.email);

    if (!account) {
      return;
    }

    if (account.status !== "active") {
      throw new BadRequestException("ACCOUNT_NOT_ACTIVE");
    }

    const token = await generateJWT({
      expirationTime: this.configService.get<string>(
        "jwt.expiresIn.passwordReset",
      )!,
      payload: {
        sub: account.id,
        user: null,
      },
      secret: this.configService.get<string>("jwt.secret.passwordReset"),
    });

    const resetUrl = `${this.configService.get<string>("email.customerFrontendUrl")}/reset-password?token=${token}`;

    await this.emailQueue.add(
      EMAIL_PROCESS_NAMES.RESET_PASSWORD_EMAIL_TO_CUSTOMER_PROCESS,
      {
        email: body.email,
        reset_url: resetUrl,
        locale: "en",
      },
    );
  }

  async resetPassword(accountId: string, body: ResetPasswordRequestBody) {
    const account = await this.authRepository.getAccountById(accountId);

    if (!account) {
      throw new BadRequestException("INVALID_TOKEN");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.newPassword, salt);

    await this.authRepository.updateCustomerAccount(account.id, {
      hash,
    });
  }

  async changePassword(accountId: string, body: ChangePasswordRequestBody) {
    const account = await this.authRepository.getAccountById(accountId);

    if (!account || !account.hash) {
      throw new UnauthorizedException("ACCOUNT_NOT_FOUND");
    }

    const isPasswordValid = await bcrypt.compare(
      body.currentPassword,
      account.hash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException("INVALID_CURRENT_PASSWORD");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.newPassword, salt);

    await this.authRepository.updateCustomerAccount(account.id, {
      hash,
    });
  }

  async refreshAccessToken(accountId: string) {
    const account = await this.authRepository.getAccountById(accountId);

    if (!account || !account.customer) {
      throw new UnauthorizedException("SESSION_EXPIRED");
    }

    if (account.status !== "active") {
      throw new UnauthorizedException("ACCOUNT_NOT_ACTIVE");
    }

    const accessToken = await generateJWT({
      expirationTime: this.configService.get<string>(
        "jwt.expiresIn.accessToken",
      )!,
      payload: {
        sub: account.customer.id,
        user: account.customer,
      },
      secret: this.configService.get<string>("jwt.secret.accessToken")!,
    });

    return accessToken;
  }

  private async sendVerificationEmail(
    customerAccountId: string,
    email: string,
  ) {
    const token = await generateJWT({
      expirationTime: this.configService.get<string>(
        "jwt.expiresIn.emailVerification",
      )!,
      payload: {
        sub: customerAccountId,
        user: null,
      },
      secret: this.configService.get<string>("jwt.secret.emailVerification"),
    });

    const emailBody: RegisterVerificationEmailToCustomer = {
      email: email,
      context: {
        token,
      },
    };

    await this.emailQueue.add(
      EMAIL_PROCESS_NAMES.REGISTER_VERIFICATION_EMAIL_TO_CUSTOMER_PROCESS,
      emailBody,
    );
  }
}
