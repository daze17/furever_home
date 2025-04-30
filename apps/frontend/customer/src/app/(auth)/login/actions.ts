"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

import { client } from "@/services/client";
import { defaultOptions } from "@/utils/create_session";

const LoginCredentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
});
type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

const Schema = LoginCredentialsSchema;

export const loginWithCredentials: React.ServerAction = async (_, formData) => {
  const parsedData = Schema.safeParse(Object.fromEntries(formData));
  if (!parsedData.success) {
    return {
      data: Object.fromEntries(
        parsedData.error.errors.map((error) => [
          error.path?.find(Boolean),
          error.message,
        ]),
      ),
      error: "INVALID PASSWORD",
      success: false,
    };
  }

  try {
    const { email, password } = parsedData.data;
    const response = await client.auth.loginCredentials({
      body: {
        email,
        password,
      },
    });

    if (response.status !== 201) {
      return {
        error: "INVALID_TOKEN",
        success: false,
      };
    }

    const { token } = response.body;
    cookies().set("session", token, defaultOptions);
  } catch (error) {
    console.log({ error });
    return {
      error: "UNKNOWN_ERROR",
      success: false,
    };
  }
  redirect("/", RedirectType.replace);
};
