"use client";

import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "ui/components/ui/button";
import { Card, CardContent } from "ui/components/ui/card";
import { FormField } from "ui/components/ui/form-field";
import { Input } from "ui/components/ui/input";
import { cn } from "utils";

import { FormWithServerAction } from "@/components/form_with_server_action";

import { registerWithCredentials } from "./actions";
import { GoogleRegister } from "./google_register";

type Props = {
  redirectTo?: string;
};
export const RegisterForm: React.FC<Props> = ({ redirectTo }) => {
  return (
    <FormWithServerAction
      action={registerWithCredentials}
      render={({ state, status }) => {
        const { pending: isPending } = status;
        // TODO: use redirect

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
              <GoogleRegister />
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
                // isLoading={isPending}
                className="w-full"
                tabIndex={isPending ? -1 : undefined}
              >
                {`Register`}
              </Button>
            </CardContent>
          </Card>
        );
      }}
    />
  );
};
