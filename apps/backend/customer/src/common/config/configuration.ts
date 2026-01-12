import { ENV, Schemas } from "./schema";

export const configuration = (overrides?: Partial<ENV>) => {
  const env: ENV = { ...ENV.parse(process.env), ...overrides };

  return {
    app: {
      env: env.APP_ENV,
      port: env.APP_PORT,
      assetHost: env.ASSET_HOST,
    },
    aws: {
      accessKey: env.AWS_ACCESS_KEY,
      region: env.AWS_REGION,
      secretKey: env.AWS_SECRET_KEY,
    },
    database: {
      url: env.DATABASE_URL,
    },
    email: {
      fromAddress: env.EMAIL_FROM_ADDRESS,
      fromName: env.EMAIL_FROM_NAME,
      // for development
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      user: env.EMAIL_USER,
      password: env.EMAIL_PASSWORD,
      // urls
      customerFrontendUrl: env.CUSTOMER_FRONTEND_URL,
    },
    minio: {
      user: env.MINIO_USER,
      password: env.MINIO_PASSWORD,
      port: env.MINIO_PORT,
      bucket: env.MINIO_BUCKET,
    },
    redis: {
      url: env.REDIS_URL,
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
    jwt: {
      expiresIn: {
        accessToken: env.JWT_EXPIRES_IN_ACCESS_TOKEN,
        emailVerification: env.JWT_EXPIRES_IN_EMAIL_VERIFICATION,
        passwordReset: env.JWT_EXPIRES_IN_PASSWORD_RESET,
        refreshToken: env.JWT_EXPIRES_IN_REFRESH_TOKEN,
        // supabase: env.JWT_EXPIRES_IN_SUPABASE,
      },
      secret: {
        accessToken: env.JWT_SECRET_ACCESS_TOKEN,
        emailVerification: env.JWT_SECRET_EMAIL_VERIFICATION,
        passwordReset: env.JWT_SECRET_PASSWORD_RESET,
        refreshToken: env.JWT_SECRET_REFRESH_TOKEN,
        //   supabase: env.JWT_SECRET_SUPABASE,
      },
    },
    // sentry: {
    //   dsn: env.SENTRY_DSN,
    // },
    s3: {
      bucket: env.AWS_S3_BUCKET,
      host: env.AWS_S3_HOST,
    },
    // ses: {
    //   accessKey: env.SES_AWS_ACCESS_KEY,
    //   region: env.SES_AWS_REGION,
    //   secretKey: env.SES_AWS_SECRET_KEY,
    // },
    // supabase: {
    //   databaseUrl: env.SUPABASE_DATABASE_URL,
    // },
    // test: { jwt: env.TEST_JWT_TOKEN },
  };
};

export const validate = (env: Record<string, any>) => {
  const appEnv = Schemas["common"].shape.APP_ENV.safeParse(env.APP_ENV);

  if (!appEnv.success) {
    console.log(appEnv.error);
    throw Error("ENV_VALIDATION_FAILED");
  }

  const schema = Schemas["common"].merge(Schemas[appEnv.data]);

  const result = schema.safeParse(env);

  if (result.success === false) {
    console.log(result.error);
    throw Error("ENV_VALIDATION_FAILED");
  }

  return result.data;
};
