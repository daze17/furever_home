"use client";

import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "ui/components/ui/button";
import { Card, CardContent } from "ui/components/ui/card";
import { FormField } from "ui/components/ui/form-field";
import { Input } from "ui/components/ui/input";
import { cn } from "utils";

import { FormWithServerAction } from "@/components/form_with_server_action";

import { loginWithCredentials } from "./actions";
import { GoogleLogin } from "./google_login";

type Props = {
  redirectTo?: string;
};
export const LoginForm: React.FC<Props> = ({ redirectTo }) => {
  const params = useSearchParams();

  const errorMessage = params.get("error") ? "Бүртгэлгүй хаяг байна!" : "";

  return (
    <FormWithServerAction
      action={loginWithCredentials}
      render={({ state, status }) => {
        const { pending: isPending } = status;

        return (
          <Card className="h-full w-full shadow-xl">
            <CardContent className="flex flex-col items-center gap-y-5 p-10">
              <Image
                src={"/furever-home-dog.jpg"}
                width={200}
                height={200}
                className={cn("h-32 w-80 object-contain")}
                alt="logo"
                priority
              />
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <GoogleLogin isPending={isPending} redirectTo={redirectTo} />
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {`Or continue with`}
                  </span>
                </div>
              </div>
              <fieldset
                className="flex w-full flex-col gap-y-2.5"
                disabled={isPending}
              >
                <FormField error={state?.data?.["email"]}>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                  />
                </FormField>

                <FormField error={state?.data?.["password"]}>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                </FormField>

                <input
                  type="hidden"
                  name="redirectTo"
                  tabIndex={-1}
                  value={redirectTo}
                />
              </fieldset>
              {state?.success === false && (
                <div className="flex h-8 items-end space-x-1">
                  {state.error === "INVALID_CREDENTIALS" && (
                    <>
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                      <p aria-live="polite" className="text-sm text-red-500">
                        Email or password is incorrect
                      </p>
                    </>
                  )}
                  {state.error === "VALIDATION_ERROR" && (
                    <>
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                      <p aria-live="polite" className="text-sm text-red-500">
                        Invalid data
                      </p>
                    </>
                  )}
                  {state.error === "UNKNOWN_ERROR" && (
                    <>
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                      <p aria-live="polite" className="text-sm text-red-500">
                        Something went wrong
                      </p>
                    </>
                  )}
                </div>
              )}
              <Button
                aria-disabled={isPending}
                disabled={isPending}
                className="w-full"
                tabIndex={isPending ? -1 : undefined}
              >
                {`Login`}
              </Button>
              <p>
                Don&#39;t have an account?{" "}
                <Link href="/register" className="text-blue-500 underline">
                  Sign up
                </Link>{" "}
                for Furever Home
              </p>
            </CardContent>
          </Card>
        );
      }}
    />
  );
};
