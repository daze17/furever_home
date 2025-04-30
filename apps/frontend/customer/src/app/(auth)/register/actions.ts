"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

import { client } from "@/services/client.server";
import { defaultOptions, sessionName } from "@/utils/create_session";

const RegisterCredentialsSchema = z.object({
  email: z.string(),
});
type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;

const Schema = RegisterCredentialsSchema;

export const registerWithCredentials: React.ServerAction = async (
  _,
  formData,
) => {
  const parsedData = Schema.safeParse(Object.fromEntries(formData));
  if (!parsedData.success) {
    // return parsedData.error;
    return {
      error: "VALIDATION_ERROR",
      success: false,
    };
  }

  try {
    const { email } = parsedData.data;
    const response = await client.auth.registerCredentials({
      body: {
        email,
      },
    });
    if (response.status !== 201) {
      return {
        error: "INVALID_CREDENTIALS",
        success: false,
      };
    }
  } catch (error) {
    console.log({ error });
    return {
      error: "UNKNOWN_ERROR",
      success: false,
    };
  }

  redirect("/register/email_sent", RedirectType.replace);
};
