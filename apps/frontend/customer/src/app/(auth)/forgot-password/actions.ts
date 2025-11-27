"use server";

import { cookies } from "next/headers";

export async function setResetEmailCookie(email: string) {
  (await cookies()).set("reset-email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes
    path: "/",
  });
}
