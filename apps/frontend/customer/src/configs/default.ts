export const authRoutes: (string | RegExp)[] = [
  "/login",
  /^\/login\/.*$/,
  "/register",
  "/register/email_sent",
  "/register/verify",
  "/register/verify/success",
  "/register/google/callback",
  "/register/create-profile",
  "/email_sent",
  "/forgot-password",
  /^\/forgot-password\/.*$/,
  "/verify",
  /^\/verify\/.*$/,
];
export const publicRoutes: (string | RegExp)[] = [
  "/",
  "/pets",
  /^\/pets.*$/,
  "/users",
  /^\/users.*$/,
  "/reset-password",
  "/faq",
];
export const allowedRoutes: (string | RegExp)[] = [
  "/",
  /^\/profile\/.*$/,
  "/settings",
  "/my_pets",
  /^\/my_pets\/.*$/,
  "/pets",
  "/favorites",
  "/users",
  /^\/users.*$/,
];

export const frontend = {
  url: process.env.NEXT_PUBLIC_FRONTEND_URL!,
};
export const backend = {
  url: process.env.NEXT_PUBLIC_BACKEND_URL!,
};
export const session = {
  secret: process.env.SESSION_SECRET!,
};
export const google = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  loginRedirectUrl: process.env.NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URL,
  registerRedirectUrl: process.env.NEXT_PUBLIC_GOOGLE_REGISTER_REDIRECT_URL,
};
