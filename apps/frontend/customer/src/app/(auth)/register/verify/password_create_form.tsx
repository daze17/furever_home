"use client";

import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  toast,
} from "ui";
import { cn } from "utils";

import { client } from "@/services/client";

type Props = {
  token: string;
};
const CreatePasswordSchema = z.object({
  token: z.string(),
});
type CreatePasswordSchema = z.infer<typeof CreatePasswordSchema>;

const passwordRegex = z
  .string()
  .min(1, "required")
  .regex(/^[!-~]+$/, "invalidChars")
  .min(8, "charLength")
  .regex(/.*[A-Z].*/, "bigLetter")
  .regex(/.*[a-z].*/, "smallLetter")
  .regex(/.*[0-9].*/, "number");

const schema = CreatePasswordSchema.extend({
  password: passwordRegex,
  password_again: passwordRegex,
}).refine(
  ({ password, password_again }) => {
    return password === password_again;
  },
  {
    message: "message",
    path: ["password_again"],
  },
);
type Schema = z.infer<typeof schema>;

export const PasswordCreateForm: React.FC<Props> = ({ token }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      token,
      password: "",
      password_again: "",
    },
  });

  const handleSubmit: SubmitHandler<Schema> = async (data) => {
    try {
      setIsPending(true);
      const response = await client.auth.verifyAccount({
        body: {
          token,
          newPassword: data.password,
          // profile: {
          //   first_name: "",
          //   last_name: "",
          //   nickname: "",
          //   address: "",
          //   phone: "",
          //   profile_image_url: "",
          //   gender: "other",
          //   zip_code: "",
          // },
        },
      });

      switch (response.status) {
        case 200:
          toast.success("Амжилттай", {
            description: "Бүртгэл баталгаажлаа",
          });
          setIsPending(false);
          router.push("/");
          break;
        case 400:
          toast.error("Буруу хүсэлт");
          setIsPending(false);
          break;
        case 401:
          toast.error("Токен буруу байна");
          setIsPending(false);
          break;
        default:
      }
    } catch (error) {
      toast.error("Алдаа", {
        description: "Тодорхойгүй алдаа гарлаа",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* form label */}
        <h1 className="font-bold">Нууц үг</h1>
        <fieldset disabled={isPending} className="flex flex-col gap-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
                      type="password"
                      placeholder={"Нууц үг"}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_again"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
                      type="password"
                      placeholder={"Нууц үг дахин оруулах"}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className={cn("mt-5 w-full text-lg", "md:text-base")}>
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            {"Бүртгүүлэх"}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};
