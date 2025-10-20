import { Inject, Injectable } from "@nestjs/common";
import {
  CreateProfileRequestBody,
  CustomerModel,
  RegisterGoogleRequestBody,
  RegisterWithEmailRequestBody,
} from "customer_api";
import { customer_accounts, customers } from "database";
import { and, eq, exists, ne } from "drizzle-orm";

import type { Database } from "@/modules/database/database.providers";

@Injectable()
export class AuthRepository {
  constructor(@Inject("DATABASE") private readonly db: Database) {}

  async getProfileById(id: string) {
    const profile = await this.db.query.customers.findFirst({
      where: eq(customers.id, id),
    });

    return profile;
  }

  async getAccountByEmail(email: string) {
    const account = await this.db.query.customer_accounts.findFirst({
      where: and(
        eq(customer_accounts.email, email),
        // TODO:
        // ne(customer_accounts.status, "inactive"),
      ),
    });
    return account;
  }

  async getAccountById(id: string) {
    return await this.db.query.customer_accounts.findFirst({
      where: eq(customer_accounts.id, id),
      with: {
        customer: true,
      },
    });
  }

  async createCustomerWithGoogle(body: RegisterGoogleRequestBody) {
    const response = await this.db.transaction(async (transaction) => {
      const customer = (
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
        customerId: customer.id,
        email: body.email,
        hash: "hash",
        status: "active",
      });

      return customer;
    });

    return response;
  }

  async createCustomerAccountByCredential(body: RegisterWithEmailRequestBody) {
    const customerAccounts = await this.db
      .insert(customer_accounts)
      .values({
        id: `email_${body.email}`,
        customerId: null,
        email: body.email,
        hash: "hash",
        status: "pending",
      })
      .returning()
      .then((userKey) => userKey.find(Boolean)!);

    return customerAccounts.id;
  }

  // TODO: drizzle zod returns unknown degrade version
  async createProfile(body: CreateProfileRequestBody, accountId: string) {
    // async createProfile(body: CustomerModel, accountId: string) {
    await this.db.transaction(async (transaction) => {
      const customerIds = await transaction
        .insert(customers)
        .values({
          first_name: body.first_name || "",
          last_name: body.last_name || "",
          nickname: body.nickname,
          address: body.address,
          phone: body.phone,
          profile_image_url: body.profile_image_url,
          gender: body.gender || "other",
          zip_code: body.zip_code,
        })
        .returning({ id: customers.id });
      const customerId = customerIds.find(Boolean)!.id;

      await transaction
        .update(customer_accounts)
        .set({ customerId, status: "active" })
        .where(eq(customer_accounts.id, accountId));
    });
  }

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
}
