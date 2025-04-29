import { InjectQueue } from "@nestjs/bullmq";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Queue } from "bullmq";
import { RegisterGoogleRequestBody } from "customer_api";
import { customer_accounts, customers } from "database";
import { eq, exists } from "drizzle-orm";
import type { JWTPayload } from "jose";
import { SignJWT } from "jose";

import {
  EMAIL_PROCESS_NAMES,
  QUEUE_PROCESSOR_NAMES,
} from "@/common/constants/queue.constants";
// import { EmailVerification } from '@/common/interfaces/email.interface';
import type { Database } from "@/modules/database/database.providers";

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue(QUEUE_PROCESSOR_NAMES.EMAIL_PROCESSOR)
    private readonly emailQueue: Queue,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject("DATABASE") private readonly db: Database,
  ) {}

  async getProfileById(id: string) {
    const profile = await this.db.query.customers.findFirst({
      where: eq(customers.id, id),
    });

    return profile;
  }

  // async getAccountByEmail(email: string) {
  //   const account = await this.db.query.user_key.findFirst({
  //     where: eq(user_key.email, email),
  //   });
  //   return account;
  // }

  async getAccountById(id: string) {
    return await this.db.query.customer_accounts.findFirst({
      where: eq(customer_accounts.id, id),
      with: {
        customer: true,
      },
    });
  }

  async createUserWithGoogle(body: RegisterGoogleRequestBody) {
    return await this.db.transaction(async (transaction) => {
      const user = (
        await transaction
          .insert(customers)
          .values({
            first_name: body.given_name,
            last_name: body.family_name,
            address: null,
            profile_image_url: body.picture,
          })
          .returning()
      ).find(Boolean)!;

      await transaction.insert(customer_accounts).values({
        id: `google_${body.sub}`,
        customerId: user.id,
        email: body.email,
        hash: "hash",
        status: "active",
      });

      return user;
    });
  }

  async generateJWT({
    expirationTime,
    payload,
    secret,
  }: {
    expirationTime: string | number | Date;
    payload?: JWTPayload;
    secret?: string;
  }) {
    const encodedSecret = new TextEncoder().encode(secret);

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expirationTime)
      .sign(encodedSecret);

    return token;
  }

  // async registerCredentials(props: RegisterWithEmailSchema) {
  //   const existingUserKey = await this.getAccountByEmail(props.email);
  //   if (existingUserKey) {
  //     await this.sendVerificationEmail(existingUserKey);
  //     return;
  //   }

  //   const userKey = await this.db
  //     .insert(user_key)
  //     .values({
  //       id: `email_${props.email}`,
  //       userId: null,
  //       isVerified: false,
  //       email: props.email,
  //       status: 'pending_verify',
  //     })
  //     .returning()
  //     .then((userKey) => userKey.find(Boolean)!);
  //   await this.sendVerificationEmail(userKey);
  // }

  // async createProfile(props: CreateProfileSchema, accountId: string) {
  //   await this.db.transaction(async (transaction) => {
  //     const userIds = await transaction
  //       .insert(users)
  //       .values(props)
  //       .returning({ id: users.id });
  //     const userId = userIds.find(Boolean)!.id;

  //     await transaction
  //       .update(user_key)
  //       .set({ userId, status: 'active' })
  //       .where(eq(user_key.id, accountId));
  //   });
  // }

  // // async updateProfile(props: CreateProfileSchema) {
  // //   await this.db.insert(users).values(props);
  // // }

  // async getProfile(id: string) {
  //   const user = await this.db.query.users.findFirst({
  //     where: exists(this.db.select().from(user_key).where(eq(user_key.id, id))),
  //   });
  //   if (!user) throw new NotFoundException();

  //   return user;
  // }

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

  // private async sendVerificationEmail(userKey: UserKeyModel) {
  //   const token = await this.generateJWT({
  //     expirationTime: this.configService.get<string>(
  //       'jwt.expiresIn.emailVerification',
  //     ),
  //     payload: {
  //       sub: userKey.id,
  //       user: null,
  //     },
  //     secret: this.configService.get<string>('jwt.secret.emailVerification'),
  //   });

  //   const emailBody: EmailVerification = {
  //     title: 'Email verification',
  //     email: userKey.email,
  //     context: {
  //       token,
  //     },
  //   };

  //   await this.emailQueue.add(
  //     EMAIL_PROCESS_NAMES.SEND_EMAIL_VERIFICATION_CODE_TO_USER_PROCESS,
  //     emailBody,
  //   );
  // }
}
