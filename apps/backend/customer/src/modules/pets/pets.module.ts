import { Module } from "@nestjs/common";

import { TransactionWorkService } from "@/modules/database/transaction_work.service";

import { PetsController } from "./pets.controller";
import { PetsRepository } from "./pets.repository";
import { PetsService } from "./pets.service";

@Module({
  imports: [],
  controllers: [PetsController],
  providers: [PetsService, PetsRepository, TransactionWorkService],
  exports: [PetsRepository, PetsService],
})
export class PetsModule {}
