import { Inject, Injectable } from "@nestjs/common";
import { UpdateCustomerSettingsRequestBody } from "customer_api";
import { customer_settings } from "database";
import { eq } from "drizzle-orm";

import type { Database } from "@/modules/database/database.providers";

@Injectable()
export class CustomerSettingsRepository {
  constructor(@Inject("DATABASE") private readonly db: Database) {}

  async getCustomerSettingsByCustomerId(customerId: string) {
    const settings = await this.db.query.customer_settings.findFirst({
      where: eq(customer_settings.customer_id, customerId),
    });

    return settings;
  }

  async updateCustomerSettings(
    customerId: string,
    data: UpdateCustomerSettingsRequestBody,
  ) {
    await this.db
      .update(customer_settings)
      .set(data)
      .where(eq(customer_settings.customer_id, customerId));
  }

  async createCustomerSettings(customerId: string) {
    await this.db.insert(customer_settings).values({
      customer_id: customerId,
      // receive_email_notification and receive_sms_notification use schema defaults (both true)
    });
  }
}
