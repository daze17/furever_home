import { Module } from "@nestjs/common";

import { CustomerSettingsController } from "./customer_settings.controller";
import { CustomerSettingsRepository } from "./customer_settings.repository";
import { CustomerSettingsService } from "./customer_settings.service";

@Module({
  imports: [],
  controllers: [CustomerSettingsController],
  providers: [CustomerSettingsService, CustomerSettingsRepository],
  exports: [CustomerSettingsRepository], // Export for use in auth module
})
export class CustomerSettingsModule {}
