"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "ui";

interface Props {
  email: string;
}

export const EmailSentDisplay: React.FC<Props> = ({ email }) => {
  const router = useRouter();

  return (
    <Card className="shadow-xl">
      <CardContent className="flex flex-col items-center gap-y-5 p-10">
        <div className="flex w-full flex-col items-center gap-y-2.5">
          <h1 className="text-2xl font-semibold">Check Your Email</h1>
          <p className="text-center text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to
          </p>
          <p className="text-center font-medium">{email}</p>
        </div>

        <div className="flex w-full flex-col items-center gap-y-2 text-xs text-muted-foreground">
          <p className="text-center">
            Click the link in the email to reset your password.
          </p>
          <p className="text-center">
            If you don&apos;t see the email, check your spam folder.
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-x-1 text-xs">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 underline"
          >
            Back to login
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
