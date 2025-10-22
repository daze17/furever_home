import { Inject, Injectable } from "@nestjs/common";
import {
  CreateCustomerProfileRequestBody,
  CustomerAccountModel,
  RegisterGoogleRequestBody,
  RegisterWithEmailRequestBody,
} from "customer_api";
import { customer_accounts, customers } from "database";
import { and, eq } from "drizzle-orm";

import type { Database } from "@/modules/database/database.providers";

@Injectable()
export class AuthRepository {
  constructor(@Inject("DATABASE") private readonly db: Database) {}

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
        customer_id: customer.id,
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
        customer_id: null,
        email: body.email,
        hash: "hash",
        status: "pending",
      })
      .returning()
      .then((userKey) => userKey.find(Boolean)!);

    return customerAccounts.id;
  }

  async createCustomerProfileAndAssignToAccount(
    accountId: string,
    data: CreateCustomerProfileRequestBody,
  ) {
    const {
      first_name,
      last_name,
      nickname,
      address,
      phone,
      profile_image_url,
      gender,
      zip_code,
    } = data;

    await this.db.transaction(async (transaction) => {
      const customerIds = await transaction
        .insert(customers)
        .values({
          first_name,
          last_name,
          nickname,
          address,
          phone,
          profile_image_url,
          gender,
          zip_code,
        })
        .returning({ id: customers.id });
      const customerId = customerIds.find(Boolean)!.id;

      await transaction
        .update(customer_accounts)
        .set({
          status: "active",
          customer_id: customerId,
        })
        .where(eq(customer_accounts.id, accountId));
    });
  }

  async updateCustomerAccount(
    accountId: string,
    data: Partial<
      Pick<CustomerAccountModel, "email" | "hash" | "status" | "customer_id">
    >,
  ) {
    const { email, hash, status, customer_id } = data;
    await this.db
      .update(customer_accounts)
      .set({ email, hash, status, customer_id })
      .where(eq(customer_accounts.id, accountId));
  }
}
