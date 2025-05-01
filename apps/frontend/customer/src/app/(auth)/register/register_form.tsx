"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

import { GoogleRegister } from "./google_register";

type Props = {
  redirectTo?: string;
};

const schema = z.object({
  email: z.string(),
});
type Schema = z.infer<typeof schema>;

export const RegisterForm: React.FC<Props> = ({ redirectTo }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    try {
      setIsPending(true);
      const response = await client.auth.registerCredentials({
        body: {
          email: data.email,
        },
      });

      switch (response.status) {
        case 201:
          // TODO: loading
          toast({
            title: "Success",
          });

          setIsPending(false);
          router.push("/");
          break;
        case 400:
          toast({
            title: "Bad request",
          });
          setIsPending(false);
          break;
        case 401:
          toast({
            title: "Invalid token",
          });
          setIsPending(false);
          break;
        default:
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "UNKNOWN_ERROR",
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
            </fieldset>
            {/* TODO: error message */}
            <Button
              aria-disabled={isPending}
              disabled={isPending}
              className="w-full"
              tabIndex={isPending ? -1 : undefined}
            >
              {`Register`}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
