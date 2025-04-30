"use server";

import { CreateProfileRequestBody } from "customer_api";
import { redirect, RedirectType } from "next/navigation";

import { client } from "@/services/client";

const Schema = CreateProfileRequestBody;

export const createProfileAction: React.ServerAction = async (_, formData) => {
  const parsedData = Schema.safeParse(Object.fromEntries(formData));
  if (!parsedData.success) {
    return {
      data: Object.fromEntries(
        parsedData.error.errors.map((error) => [
          error.path?.find(Boolean),
          error.message,
        ]),
      ),
      error: "VALIDATION_ERROR",
      success: false,
    };
  }

  try {
    // const response = await client.auth.createProfile({
    //   body: {
    //     ...parsedData.data,
    //     // TODO:
    //     profileImage: "",
    //   },
    // });
    // if (response.status !== 201) {
    //   return {
    //     error: "INVALID_TOKEN",
    //     success: false,
    //   };
    // }
  } catch (error) {
    console.log({ error });
    return {
      error: "UNKNOWN_ERROR",
      success: false,
    };
  }
  redirect("/", RedirectType.replace);
};
