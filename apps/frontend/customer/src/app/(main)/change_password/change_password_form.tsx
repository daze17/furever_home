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
  .min(1, "Нууц үг шаардлагатай")
  .regex(/^[!-~]+$/, "Буруу тэмдэгт")
  .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой")
  .regex(/.*[A-Z].*/, "Нууц үг дор хаяж нэг том үсэг агуулсан байх ёстой")
  .regex(/.*[a-z].*/, "Нууц үг дор хаяж нэг жижиг үсэг агуулсан байх ёстой")
  .regex(/.*[0-9].*/, "Нууц үг дор хаяж нэг тоо агуулсан байх ёстой");

const schema = ChangePasswordRequestBody.extend({
  confirmPassword: z.string().min(1, "Нууц үгээ баталгаажуулна уу"),
}).refine(
  ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
  {
    message: "Нууц үг таарахгүй байна",
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
          toast.success("Нууц үг амжилттай солигдлоо", {
            description: "Шинэ нууц үгээрээ нэвтэрнэ үү",
          });
          // Clear session and redirect to login
          await fetch("/api/session", { method: "DELETE" });
          router.push("/login");
          break;
        case 400:
          toast.error("Одоогийн нууц үг буруу байна", {
            description: "Одоогийн нууц үгээ шалгаад дахин оролдоно уу",
          });
          break;
        case 401:
          toast.error("Зөвшөөрөлгүй", {
            description: "Дахин нэвтэрнэ үү",
          });
          router.push("/login");
          break;
        default:
          toast.error("Алдаа гарлаа", {
            description: "Дараа дахин оролдоно уу",
          });
      }
    } catch (error) {
      toast.error("Алдаа", {
        description: "Нууц үг солих боломжгүй",
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
              <h1 className="text-2xl font-semibold">Нууц үг солих</h1>
              <p className="text-center text-sm text-muted-foreground">
                Бүртгэлийн нууц үгээ шинэчлэх
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
                    <FormLabel>Одоогийн нууц үг</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="password"
                        placeholder="Одоогийн нууц үг"
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
                      <FormLabel>Шинэ нууц үг</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="password"
                          placeholder="Шинэ нууц үг"
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
                        <FormLabel>Шинэ нууц үг баталгаажуулах</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="password"
                            placeholder="Шинэ нууц үг баталгаажуулах"
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
              <p className="font-medium">Нууц үгийн шаардлага:</p>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>Хамгийн багадаа 8 тэмдэгт</li>
                <li>Дор хаяж нэг том үсэг</li>
                <li>Дор хаяж нэг жижиг үсэг</li>
                <li>Дор хаяж нэг тоо</li>
              </ul>
            </div>

            <div className="flex w-full gap-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Цуцлах
              </Button>
              <Button disabled={isPending} className="w-full">
                {isPending ? "Солиж байна..." : "Нууц үг солих"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
