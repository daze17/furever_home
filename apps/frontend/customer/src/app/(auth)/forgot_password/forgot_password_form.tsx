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
          toast.success("Нууц үг сэргээх имэйл илгээгдлээ", {
            description: "Имэйлээ шалгана уу",
          });
          await setResetEmailCookie(data.email);
          router.push("/forgot_password/email_sent");
          break;
        case 400:
          toast.error("Имэйл хаяг буруу байна");
          break;
        default:
          toast.error("Алдаа гарлаа", {
            description: "Дараа дахин оролдоно уу",
          });
      }
    } catch (error) {
      toast.error("Алдаа", {
        description: "Нууц үг сэргээх имэйл илгээх боломжгүй",
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
              <h1 className="text-2xl font-semibold">Нууц үг сэргээх</h1>
              <p className="text-center text-sm text-muted-foreground">
                Имэйл хаягаа оруулна уу, бид танд нууц үг сэргээх холбоос илгээх
                болно
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
                        placeholder="Имэйл хаяг"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <Button disabled={isPending} className="w-full">
              {isPending ? "Илгээж байна..." : "Холбоос илгээх"}
            </Button>

            <div className="flex w-full items-center justify-center gap-x-1 text-xs">
              <span className="text-muted-foreground">
                Нууц үгээ санаж байна уу?
              </span>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-500 underline"
              >
                Нэвтрэх хуудас руу буцах
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
