import { z } from "zod";

import { c } from "@/contract";
import {
  ChangePasswordRequestBody,
  CreateCustomerProfileRequestBody,
  ForgotPasswordRequestBody,
  LoginCredentialsRequestBody,
  LoginGoogleRequestBody,
  RateLimitError,
  RefreshTokenRequestBody,
  RegisterGoogleRequestBody,
  RegisterWithEmailRequestBody,
  ResetPasswordRequestBody,
  TokenResponseBody,
  VerifyAccountRequestBody,
} from "@/schemas/dtos";
import { CustomError } from "@/models/custom_error";

export const authContract = c.router({
  loginGoogle: {
    method: "POST",
    path: "/login/google",
    body: LoginGoogleRequestBody,
    responses: {
      201: TokenResponseBody,
      400: CustomError,
    },
    summary: "login google",
  },
  loginCredentials: {
    method: "POST",
    path: "/login/credentials",
    body: LoginCredentialsRequestBody,
    responses: {
      201: TokenResponseBody,
      400: CustomError,
    },
    summary: "login credentials",
  },
  registerGoogle: {
    method: "POST",
    path: "/register/google",
    body: RegisterGoogleRequestBody,
    responses: {
      // TODO: check?
      201: TokenResponseBody,
      400: CustomError,
    },
    summary: "register google",
  },
  registerCredentials: {
    method: "POST",
    path: "/register/credentials",
    body: RegisterWithEmailRequestBody,
    responses: {
      201: z.object({}),
      400: CustomError,
      429: RateLimitError,
    },
    summary: "register credentials",
  },
  verifyAccount: {
    method: "POST",
    path: "/register/verify",
    body: VerifyAccountRequestBody,
    responses: {
      200: TokenResponseBody,
      400: CustomError,
    },
    summary: "verify email and complete registration with profile",
  },
  // getCustomerProfile: {
  //   method: "GET",
  //   path: "/profile",
  //   responses: {
  //     200: UserProfileResponse,
  //     400: CustomError,
  //   },
  //   summary: "get profile",
  // },

  // Password Management
  forgotPassword: {
    method: "POST",
    path: "/forgot-password",
    body: ForgotPasswordRequestBody,
    responses: {
      201: z.object({}),
      400: CustomError,
    },
    summary: "request password reset",
  },
  resetPassword: {
    method: "POST",
    path: "/reset-password",
    body: ResetPasswordRequestBody,
    responses: {
      201: z.object({}),
      400: CustomError,
      401: CustomError,
    },
    summary: "reset password with token",
  },
  changePassword: {
    method: "PATCH",
    path: "/change-password",
    body: ChangePasswordRequestBody,
    responses: {
      200: z.object({}),
      400: CustomError,
      401: CustomError,
    },
    summary: "change password (authenticated)",
  },

  // Token Management
  refreshToken: {
    method: "POST",
    path: "/refresh",
    body: RefreshTokenRequestBody,
    responses: {
      201: TokenResponseBody,
      401: CustomError,
    },
    summary: "refresh access token",
  },
});
