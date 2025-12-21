import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  server: {
    SESSION_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BACKEND_URL: z.string().min(1),
    NEXT_PUBLIC_FRONTEND_URL: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URL: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_REGISTER_REDIRECT_URL: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URL:
      process.env.NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URL,
    NEXT_PUBLIC_GOOGLE_REGISTER_REDIRECT_URL:
      process.env.NEXT_PUBLIC_GOOGLE_REGISTER_REDIRECT_URL,
  },
  // test
});
export default env;
