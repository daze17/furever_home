"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordRequestBody } from "customer_api";
import { z } from "zod";
import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

const schema = ChangePasswordRequestBody.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(
  ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

type Schema = z.infer<typeof schema>;

export const ChangePasswordForm: React.FC = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    try {
      setIsPending(true);
      const response = await client.auth.changePassword({
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });

      switch (response.status) {
        case 200:
          toast.success("Password changed successfully", {
            description: "Please login with your new password",
          });
          // Clear session and redirect to login
          await fetch("/api/session", { method: "DELETE" });
          router.push("/login");
          break;
        case 400:
          toast.error("Invalid current password", {
            description: "Please check your current password and try again",
          });
          break;
        case 401:
          toast.error("Unauthorized", {
            description: "Please login again",
          });
          router.push("/login");
          break;
        default:
          toast.error("Something went wrong", {
            description: "Please try again later",
          });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Unable to change password",
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
              <h1 className="text-2xl font-semibold">Change Password</h1>
              <p className="text-center text-sm text-muted-foreground">
                Update your account password
              </p>
            </div>

            <fieldset
              disabled={isPending}
              className="flex w-full flex-col gap-y-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="password"
                        placeholder="Enter current password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="password"
                          placeholder="Enter new password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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

            <div className="flex w-full gap-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Cancel
              </Button>
              <Button disabled={isPending} className="w-full">
                {isPending ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
