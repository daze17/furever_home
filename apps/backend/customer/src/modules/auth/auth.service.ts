import { InjectQueue } from "@nestjs/bullmq";
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Queue } from "bullmq";
import {
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

import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue(QUEUE_PROCESSOR_NAMES.EMAIL_PROCESSOR)
    private readonly emailQueue: Queue,
    private readonly: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
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

  async createProfile(body: VerifyAccountRequestBody, accountId: string) {
    // TODO:
    // await this.authRepository.createProfile(body.profile, accountId);
  }

  // async verifyAccount({ token, newPassword }: VerifyAccountSchema) {
  //   const payload = await this.jwtService
  //     .verifyAsync<{ email: string }>(token, {
  //       secret: this.configService.get<string>('jwt.secret.emailVerification'),
  //     })
  //     .then((payload) => payload)
  //     .catch((error) => {
  //       if (error instanceof Error) {
  //         console.log(error, 'error');
  //       }
  //       return null;
  //     });

  //   if (!payload) {
  //     throw new BadRequestException('INVALID_TOKEN');
  //   }

  //   const { sub } = payload;

  //   const account = await this.db.query.user_key.findFirst({
  //     where: eq(user_key.id, sub),
  //     with: {
  //       user: true,
  //     },
  //   });

  //   if (!account) {
  //     throw new BadRequestException('INVALID_TOKEN');
  //   }

  //   const salt = await bcrypt.genSalt(10);
  //   const hash = await bcrypt.hash(newPassword, salt);

  //   await this.db.transaction(async (transaction) => {
  //     const _updatedUserProfile = await transaction
  //       .update(user_key)
  //       .set({
  //         hashedPassword: hash,
  //         status: 'pending_profile',
  //         isVerified: true,
  //       })
  //       .where(eq(user_key.id, account.id))
  //       .returning({
  //         email: user_key.email,
  //         phoneNumber: user_key.phoneNumber,
  //       });

  //     const updatedUserProfile = _updatedUserProfile.find(Boolean);
  //     if (!updatedUserProfile) throw new Error();
  //   });
  // }
  //

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
