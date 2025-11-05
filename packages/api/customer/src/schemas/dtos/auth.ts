import { z } from "zod";

import { CustomerAccountModel, CustomerModel } from "@/models";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[!-~]{8,}$/;

export const LoginCredentialsRequestBody = z.object({
  email: z.string(),
  password: z.string(),
});
export type LoginCredentialsRequestBody = z.infer<
  typeof LoginCredentialsRequestBody
>;

export const LoginGoogleRequestBody = z.object({
  sub: z.string(),
});
export type LoginGoogleRequestBody = z.infer<typeof LoginGoogleRequestBody>;

export const TokenResponseBody = z.object({
  token: z.string(),
});
export type TokenResponseBody = z.infer<typeof TokenResponseBody>;

// Register
export const RegisterWithEmailRequestBody = CustomerAccountModel.pick({
  email: true,
});
export type RegisterWithEmailRequestBody = z.infer<
  typeof RegisterWithEmailRequestBody
>;

export const RegisterGoogleRequestBody = z.object({
  email: z.string(),
  sub: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
});
export type RegisterGoogleRequestBody = z.infer<
  typeof RegisterGoogleRequestBody
>;

export const GoogleRegisterResponseBody = z.object({
  token: z.string(),
});
export type GoogleRegisterResponseBody = z.infer<
  typeof GoogleRegisterResponseBody
>;

export const VerifyAccountRequestBody = z.object({
  token: z.string(),
  newPassword: z.string().regex(passwordRegex),
  // profile: CreateProfileRequestBody,
});
export type VerifyAccountRequestBody = z.infer<typeof VerifyAccountRequestBody>;

// export const RegisterWithPhoneSchema = CustomerAccountModel.pick({ phoneNumber: true });
// export type RegisterWithPhoneSchema = z.infer<typeof RegisterWithPhoneSchema>;

export const SessionSchema = z.object({
  // user: UserModel.nullable(),
  sub: z.string(),
});
export type SessionSchema = z.infer<typeof SessionSchema>;

export const AccountResponseBody = CustomerAccountModel.pick({
  id: true,
  email: true,
  status: true,
  customer_id: true,
}).extend({
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  // id: uuid("id").defaultRandom().primaryKey(),
  // email: text("email").notNull().unique(),
  // hash: text("hash").notNull(),
  // status: status("status").notNull(),
  // customer_id: uuid("customer_id").references(() => customers.id, {
  //   onDelete: "cascade",
  // }),
});
export type AccountResponseBody = z.infer<typeof AccountResponseBody>;

// export const UserProfileResponse = UserModel;
// export type UserProfileResponse = z.infer<typeof UserProfileResponse>;
