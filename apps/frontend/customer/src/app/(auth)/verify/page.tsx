"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "ui";
import { Loader2Icon } from "lucide-react";

const VerifyPage: React.Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      // No token provided, redirect to register
      router.push("/register");
      return;
    }

    // Redirect to the password creation page with the token
    router.push(`/register/verify?token=${token}`);
  }, [router, searchParams]);

  return (
    <main className="flex h-[calc(100dvh-190px)] w-full items-center justify-center">
      <Card className="shadow-xl">
        <CardContent className="flex flex-col items-center gap-y-5 p-10">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          <div className="flex flex-col items-center gap-y-2">
            <h1 className="text-xl font-semibold">Verifying your email...</h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your account
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default VerifyPage;
