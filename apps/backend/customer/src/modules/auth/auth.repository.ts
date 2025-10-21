import { Inject, Injectable } from "@nestjs/common";
import {
  CreateProfileRequestBody,
  RegisterGoogleRequestBody,
  RegisterWithEmailRequestBody,
} from "customer_api";
import { customer_accounts, customers } from "database";
import { and, eq } from "drizzle-orm";

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

  async verifyAccount(accountId: string, newHash: string) {
    await this.db
      .update(customer_accounts)
      .set({
        status: "active",
        hash: newHash,
      })
      .where(eq(customer_accounts.id, accountId));
  }
}
