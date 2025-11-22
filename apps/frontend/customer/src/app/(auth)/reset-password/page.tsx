"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "ui";

import { ResetPasswordForm } from "./reset_password_form";

const ResetPasswordPage: React.Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      router.push("/forgot-password");
      return;
    }
    setToken(tokenParam);
  }, [router, searchParams]);

  if (!token) {
    return (
      <main className="flex h-[calc(100dvh-190px)] w-full items-center justify-center">
        <Card className="shadow-xl">
          <CardContent className="p-10">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100dvh-190px)] w-full items-center justify-center">
      <ResetPasswordForm token={token} />
    </main>
  );
};

export default ResetPasswordPage;
