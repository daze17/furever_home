"use client";

import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "ui/components/ui/button";
import { Card, CardContent } from "ui/components/ui/card";
import { Input } from "ui/components/ui/input";
import { cn } from "utils";

import { GoogleLogin } from "./google_login";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { LoginCredentialsRequestBody } from "api/customer";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  redirectTo?: string;
};
const schema = LoginCredentialsRequestBody;
type Schema = z.infer<typeof schema>;

export const LoginForm: React.FC<Props> = ({ redirectTo }) => {
  const [isPending, setIsPending] = useState(false);
  const params = useSearchParams();

  const errorMessage = params.get("error") ? "Бүртгэлгүй хаяг байна!" : "";
  // TODO: zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  return (
    <>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
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
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
              className="flex w-full flex-col gap-y-2.5"
              disabled={isPending}
            >
              <Input
                {...register("email")}
                id="email"
                name="email"
                placeholder="Email"
                type="email"
              />

              <Input
                {...register("password")}
                id="password"
                name="password"
                placeholder="Password"
                type="password"
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
    </>
  );
};
