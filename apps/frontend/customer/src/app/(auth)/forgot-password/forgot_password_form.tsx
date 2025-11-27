"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordRequestBody } from "customer_api";
import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  toast,
} from "ui";

import { client } from "@/services/client";
import { setResetEmailCookie } from "./actions";

type Schema = typeof ForgotPasswordRequestBody._type;

export const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(ForgotPasswordRequestBody),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    try {
      setIsPending(true);
      const response = await client.auth.forgotPassword({
        body: data,
      });

      switch (response.status) {
        case 201:
          toast.success("Password reset email sent", {
            description: "Check your email for reset instructions",
          });
          await setResetEmailCookie(data.email);
          router.push("/forgot-password/email-sent");
          break;
        case 400:
          toast.error("Invalid email address");
          break;
        default:
          toast.error("Something went wrong", {
            description: "Please try again later",
          });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Unable to send password reset email",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="shadow-xl">
          <CardContent className="flex flex-col items-center gap-y-5 p-10">
            <div className="flex w-full flex-col items-center gap-y-2.5">
              <h1 className="text-2xl font-semibold">Forgot Password</h1>
              <p className="text-center text-sm text-muted-foreground">
                Enter your email address and we&apos;ll send you a link to
                reset your password
              </p>
            </div>

            <fieldset
              disabled={isPending}
              className="flex w-full flex-col gap-y-2.5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="email"
                        placeholder="Email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <Button disabled={isPending} className="w-full">
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="flex w-full items-center justify-center gap-x-1 text-xs">
              <span className="text-muted-foreground">
                Remember your password?
              </span>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-500 underline"
              >
                Back to login
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
