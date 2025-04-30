"use server";

import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

import { client } from "@/services/client.server";

const CreatePasswordSchema = z.object({
  token: z.string(),
});
type CreatePasswordSchema = z.infer<typeof CreatePasswordSchema>;

const passwordRegex = z
  .string()
  .min(1, "required")
  .regex(/^[!-~]+$/, "invalidChars")
  .min(8, "charLength")
  .regex(/.*[A-Z].*/, "bigLetter")
  .regex(/.*[a-z].*/, "smallLetter")
  .regex(/.*[0-9].*/, "number");

const Schema = CreatePasswordSchema.extend({
  newPassword: passwordRegex,
  newPassAgain: passwordRegex,
}).refine(
  ({ newPassword, newPassAgain }) => {
    return newPassword === newPassAgain;
  },
  {
    message: "message",
    path: ["newPassAgain"],
  },
);

export const registerVerify: React.ServerAction = async (_, formData) => {
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
      // error: parsedData.error.errors,
    };
  }

  try {
    const { newPassword, token } = parsedData.data;

    const response = await client.auth.verifyAccount({
      body: {
        token,
        newPassword,
        profile: {},
      },
    });

    if (response.status === 400) {
      return {
        error: "INVALID_TOKEN",
        success: false,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      error: "UNKNOWN_ERROR",
      success: false,
    };
  }

  redirect("/register/verify/success", RedirectType.replace);
};
