import { Inject, Injectable } from "@nestjs/common";
import {
  CreateCustomerProfileRequestBody,
  CustomerAccountModel,
  RegisterGoogleRequestBody,
  RegisterWithEmailRequestBody,
} from "customer_api";
import { customer_accounts, customer_settings, customers } from "database";
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
      with: {
        customer: true,
      },
    });
    return account;
  }

  async getAccountById(id: string) {
    return await this.db.query.customer_accounts.findFirst({
      where: eq(customer_accounts.id, id),
      with: {
        customer: {
          with: {
            customer_settings: true,
          },
        },
      },
    });
  }

  async createCustomerWithGoogle(body: RegisterGoogleRequestBody) {
    console.log(body, "body");
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

      // Create customer settings with defaults
      await transaction.insert(customer_settings).values({
        customer_id: customer.id,
      });

      await transaction.insert(customer_accounts).values({
        id: `google_${body.sub}`,
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
        id: `email_${body.email}`,
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

  async completeRegistration(
    accountId: string,
    hash: string,
    profileData: CreateCustomerProfileRequestBody,
  ) {
    return await this.db.transaction(async (transaction) => {
      const customerIds = await transaction
        .insert(customers)
        .values({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          nickname: profileData.nickname,
          address: profileData.address,
          phone: profileData.phone,
          profile_image_url: profileData.profile_image_url,
          gender: profileData.gender,
          zip_code: profileData.zip_code,
        })
        .returning({ id: customers.id });

      const customerId = customerIds.find(Boolean)!.id;

      // Create customer settings with defaults
      await transaction.insert(customer_settings).values({
        customer_id: customerId,
      });

      await transaction
        .update(customer_accounts)
        .set({
          hash,
          customer_id: customerId,
          status: "active",
        })
        .where(eq(customer_accounts.id, accountId));

      const account = await transaction.query.customer_accounts.findFirst({
        where: eq(customer_accounts.id, accountId),
        with: {
          customer: {
            with: {
              customer_settings: true,
            },
          },
        },
      });

      return account!;
    });
  }
}
