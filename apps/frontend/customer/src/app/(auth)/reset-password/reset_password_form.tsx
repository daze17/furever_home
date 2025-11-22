"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordRequestBody } from "customer_api";
import { z } from "zod";
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

// Password validation schema with confirmation
const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .regex(/^[!-~]+$/, "Invalid characters")
  .min(8, "Password must be at least 8 characters")
  .regex(/.*[A-Z].*/, "Password must contain at least one uppercase letter")
  .regex(/.*[a-z].*/, "Password must contain at least one lowercase letter")
  .regex(/.*[0-9].*/, "Password must contain at least one number");

const schema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
}) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    try {
      setIsPending(true);
      const response = await client.auth.resetPassword({
        body: {
          token,
          newPassword: data.newPassword,
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      switch (response.status) {
        case 201:
          toast.success("Password reset successful", {
            description: "You can now login with your new password",
          });
          router.push("/login");
          break;
        case 400:
          toast.error("Invalid request", {
            description: "Please check your password requirements",
          });
          break;
        case 401:
          toast.error("Invalid or expired token", {
            description: "Please request a new password reset link",
          });
          setTimeout(() => router.push("/forgot-password"), 2000);
          break;
        default:
          toast.error("Something went wrong", {
            description: "Please try again later",
          });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Unable to reset password",
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
              <h1 className="text-2xl font-semibold">Reset Password</h1>
              <p className="text-center text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <fieldset
              disabled={isPending}
              className="flex w-full flex-col gap-y-2.5"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="password"
                        placeholder="New password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="password"
                        placeholder="Confirm password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <div className="w-full text-xs text-muted-foreground">
              <p className="font-medium">Password requirements:</p>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains at least one uppercase letter</li>
                <li>Contains at least one lowercase letter</li>
                <li>Contains at least one number</li>
              </ul>
            </div>

            <Button disabled={isPending} className="w-full">
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
