import { InjectQueue } from "@nestjs/bullmq";
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { Queue } from "bullmq";
import {
  CreateCustomerProfileRequestBody,
  RegisterGoogleRequestBody,
  RegisterWithEmailRequestBody,
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

  async createCustomerProfile(
    accountId: string,
    body: CreateCustomerProfileRequestBody,
  ) {
    const customerProfileId =
      await this.customerRepository.createCustomerProfile(body);
    await this.authRepository.updateCustomerAccount(accountId, {
      status: "active",
      customer_id: customerProfileId,
    });
  }

  async verifyAccount({ token, newPassword }: VerifyAccountRequestBody) {
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

    const account = await this.authRepository.getAccountById(payload.sub);

    if (!account) {
      throw new BadRequestException("INVALID_TOKEN");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // TODO: send email
    await this.authRepository.updateCustomerAccount(account.id, {
      status: "active",
      hash,
    });
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
