"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginCredentialsRequestBody } from "customer_api";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { cn } from "utils";

import { client } from "@/services/client";

import { GoogleLogin } from "./google_login";

type Props = {
  redirectTo?: string;
};
const schema = LoginCredentialsRequestBody;
type Schema = z.infer<typeof schema>;

export const LoginForm: React.FC<Props> = ({ redirectTo }) => {
  const [isPending, setIsPending] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  // const errorMessage = params.get("error") ? "Бүртгэлгүй хаяг байна!" : "";
  // TODO: zod validation
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    try {
      setIsPending(true);
      const response = await client.auth.loginCredentials({
        body: {
          email: data.email,
          password: data.password,
        },
      });

      switch (response.status) {
        case 201:
          toast.success("Амжилттай нэвтэрлээ");
          setIsPending(false);
          router.push("/");
          break;
        case 400:
          toast.error("Буруу хүсэлт");
          setIsPending(false);
          break;
        case 401:
          toast.error("И-мэйл эсвэл нууц үг буруу байна");
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
            {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
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
              disabled={isPending}
              className="flex w-full flex-col gap-y-2.5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          disabled={form.formState.isSubmitting}
                          placeholder={"email"}
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          placeholder={"password"}
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            {/* TODO:react hook form errors zod validation */}
            <Button
              aria-disabled={isPending}
              disabled={isPending}
              className="w-full"
              tabIndex={isPending ? -1 : undefined}
            >
              {`Login`}
            </Button>
            <div className="flex w-full items-center justify-center">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500 underline"
              >
                Forgot password?
              </Link>
            </div>
            <p>
              Don&#39;t have an account?{" "}
              <Link href="/register" className="text-blue-500 underline">
                Sign up
              </Link>{" "}
              for Furever Home
            </p>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
