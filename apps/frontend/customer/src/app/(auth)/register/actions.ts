"use server";

import { cookies } from "next/headers";

export async function setRegistrationEmailCookie(email: string) {
  cookies().set("registration_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
}

export async function setLastResendTimestamp(timestamp: number) {
  cookies().set("last_resend_timestamp", timestamp.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
}
