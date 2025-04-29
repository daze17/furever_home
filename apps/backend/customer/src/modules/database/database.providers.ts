import { ConfigModule, ConfigService } from '@nestjs/config';
import type { Schema } from 'database';
import { schema } from 'database';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type {
  PostgresJsDatabase,
  PostgresJsQueryResultHKT,
} from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

import {
  databaseClientProviderToken,
  databaseProviderToken,
} from '@/common/constants/provider_tokens.constants';

export const databaseProviders = [
  {
    imports: [ConfigModule],
    inject: [ConfigService],
    provide: databaseClientProviderToken,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('database.url')!;

      // Disable prefetch as it is not supported for "Transaction" pool mode
      const client = postgres(url, { prepare: false });

      return client;
    },
  },
  {
    inject: [databaseClientProviderToken],
    provide: databaseProviderToken,
    useFactory: async (client: Sql) => {
      const db = drizzle(client, { schema });

      return db;
    },
  },
];
export type Database = PostgresJsDatabase<Schema>;
export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  Schema,
  ExtractTablesWithRelations<Schema>
>;
