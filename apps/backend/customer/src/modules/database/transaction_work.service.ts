import { Inject, Injectable } from "@nestjs/common";

import { databaseProviderToken } from "@/common/constants/provider_tokens.constants";
import type {
  Database,
  Transaction,
} from "@/modules/database/database.providers";

/**
 * TransactionWorkService provides transaction management for multiple repository operations
 *
 * Usage:
 * ```typescript
 * await this.transactionWorkService.run(async (tx) => {
 *   await this.userRepo.softDelete(userId, 'admin', tx);
 *   await this.storeRepo.softDelete(storeId, 'admin', tx);
 * });
 * ```
 */
@Injectable()
export class TransactionWorkService {
  constructor(@Inject(databaseProviderToken) private readonly db: Database) {}

  /**
   * Execute multiple operations within a single database transaction
   *
   * @param fn - Function containing repository operations to run in transaction
   * @returns The result of the function execution
   *
   * @example
   * ```typescript
   * const result = await transactionWorkService.run(async (tx) => {
   *   const user = await userRepository.create(userData, tx);
   *   await storeRepository.assignUser(storeId, user.id, tx);
   *   return user;
   * });
   * ```
   */
  async run<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx) => {
      return fn(tx);
    });
  }
}
