"use client";

import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { Button, FormField, Input } from "ui";
import { cn } from "utils";

import { FormWithServerAction } from "@/components/form_with_server_action";

import { registerVerify } from "./actions";

type Props = {
  token: string;
};

export const PasswordCreateForm: React.FC<Props> = ({ token }) => {
  return (
    <FormWithServerAction
      action={registerVerify}
      render={({ state, status }) => {
        const { pending: isPending } = status;
        return (
          <div>
            <h1 className="font-bold">Password</h1>
            <fieldset className="flex flex-col gap-y-5">
              <FormField error={state?.data?.["newPassword"]}>
                <Input
                  id="newPassword"
                  name="newPassword"
                  placeholder="new password"
                  type="password"
                  className={cn(
                    state?.data?.["newPassword"] && "border-red-500",
                  )}
                />
              </FormField>

              <FormField error={state?.data?.["newPassAgain"]}>
                <Input
                  id="newPassAgain"
                  name="newPassAgain"
                  placeholder="new password again"
                  type="password"
                  className={cn(
                    state?.data?.["newPassword"] && "border-red-500",
                  )}
                />
              </FormField>
              {/* send token to action.ts */}
              <Input type="hidden" name="token" value={token} />

              {state?.success === false && (
                <div className="flex h-8 items-end space-x-1">
                  {state.error === "UNKNOWN_ERROR" && (
                    <>
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                      <p aria-live="polite" className="text-sm text-red-500">
                        Interal server error
                      </p>
                    </>
                  )}
                  {state.error && (
                    <>
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                      <p aria-live="polite" className="text-sm text-red-500">
                        {state.error}
                      </p>
                    </>
                  )}
                </div>
              )}
            </fieldset>
            <Button
              className={cn("mt-5 w-full text-lg", "md:text-base")}
              disabled={isPending}
            >
              {isPending && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {"Бүртгүүлэх"}
            </Button>
          </div>
        );
      }}
    />
  );
};
