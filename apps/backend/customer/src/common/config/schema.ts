import { z } from 'zod';

const commonSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'staging']),
  APP_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
});

const developmentSchema = z.object({
  //   MINIO_USER: z.string(),
  //   MINIO_PASSWORD: z.string(),
  //   MINIO_BUCKET: z.string(),
  //   MINIO_PORT: z.coerce.number(),
});
const productionSchema = z.object({
  //   AWS_ACCESS_KEY: z.string(),
  //   AWS_REGION: z.string(),
  //   AWS_SECRET_KEY: z.string(),
  //   SES_AWS_ACCESS_KEY: z.string(),
  //   SES_AWS_REGION: z.string(),
  //   SES_AWS_SECRET_KEY: z.string(),
});
const stagingSchema = z.object({
  //   AWS_ACCESS_KEY: z.string(),
  //   AWS_REGION: z.string(),
  //   AWS_SECRET_KEY: z.string(),
  //   AWS_S3_BUCKET: z.string(),
  //   AWS_S3_HOST: z.string(),
  //   SES_AWS_ACCESS_KEY: z.string(),
  //   SES_AWS_REGION: z.string(),
  //   SES_AWS_SECRET_KEY: z.string(),
});
export const Schemas = {
  common: commonSchema,
  development: developmentSchema,
  production: productionSchema,
  staging: stagingSchema,
};
export const ENV = commonSchema
  .merge(developmentSchema.partial())
  .merge(productionSchema.partial())
  .merge(stagingSchema.partial());
export type ENV = z.infer<typeof ENV>;
