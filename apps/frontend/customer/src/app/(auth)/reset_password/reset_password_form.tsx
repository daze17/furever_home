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
  .min(1, "Нууц үг шаардлагатай")
  .regex(/^[!-~]+$/, "Буруу тэмдэгт")
  .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой")
  .regex(/.*[A-Z].*/, "Нууц үг дор хаяж нэг том үсэг агуулсан байх ёстой")
  .regex(/.*[a-z].*/, "Нууц үг дор хаяж нэг жижиг үсэг агуулсан байх ёстой")
  .regex(/.*[0-9].*/, "Нууц үг дор хаяж нэг тоо агуулсан байх ёстой");

const schema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Нууц үгээ баталгаажуулна уу"),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: "Нууц үг таарахгүй байна",
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
          toast.success("Нууц үг амжилттай сэргээгдлээ", {
            description: "Та шинэ нууц үгээрээ нэвтэрч болно",
          });
          router.push("/login");
          break;
        case 400:
          toast.error("Буруу хүсэлт", {
            description: "Нууц үгийн шаардлагыг шалгана уу",
          });
          break;
        case 401:
          toast.error("Хүчингүй эсвэл хугацаа дууссан токен", {
            description: "Шинэ нууц үг сэргээх холбоос авна уу",
          });
          setTimeout(() => router.push("/forgot_password"), 2000);
          break;
        default:
          toast.error("Алдаа гарлаа", {
            description: "Дараа дахин оролдоно уу",
          });
      }
    } catch (error) {
      toast.error("Алдаа", {
        description: "Нууц үг сэргээх боломжгүй",
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
                Шинэ нууц үгээ оруулна уу
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
                        placeholder="Шинэ нууц үг"
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
                        placeholder="Нууц үг баталгаажуулах"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

            <Button disabled={isPending} className="w-full">
              {isPending ? "Сэргээж байна..." : "Нууц үг сэргээх"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
