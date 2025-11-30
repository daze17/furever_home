"use client";

import { Loader2Icon } from "lucide-react";
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
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "ui";
import { cn } from "utils";

import { client } from "@/services/client";

type Props = {
  token: string;
};

// Password validation regex
const passwordRegex = z
  .string()
  .min(1, "required")
  .regex(/^[!-~]+$/, "invalidChars")
  .min(8, "charLength")
  .regex(/.*[A-Z].*/, "bigLetter")
  .regex(/.*[a-z].*/, "smallLetter")
  .regex(/.*[0-9].*/, "number");

// Combined schema: password + profile fields
const schema = z
  .object({
    token: z.string(),
    password: passwordRegex,
    password_again: passwordRegex,
    // Profile fields
    first_name: z.string().min(1, "Нэр оруулна уу"),
    last_name: z.string().min(1, "Овог оруулна уу"),
    nickname: z.string().optional(),
    gender: z.enum(["male", "female", "other"]),
    phone: z.string().optional(),
    zip_code: z.string().optional(),
    address: z.string().optional(),
    profile_image_url: z.string().optional(),
  })
  .refine(({ password, password_again }) => password === password_again, {
    message: "Нууц үг таарахгүй байна",
    path: ["password_again"],
  });

type Schema = z.infer<typeof schema>;

const ProfileCreateForm: React.FC<Props> = ({ token }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      token,
      password: "",
      password_again: "",
      first_name: "",
      last_name: "",
      nickname: "",
      gender: "other",
      phone: "",
      zip_code: "",
      address: "",
      profile_image_url: "",
    },
  });

  const handleSubmit: SubmitHandler<Schema> = async (data) => {
    try {
      setIsPending(true);

      // Extract password_again (not sent to backend)
      const { password_again, ...requestData } = data;

      const response = await client.auth.verifyAccount({
        body: {
          token,
          newPassword: requestData.password,
          first_name: requestData.first_name,
          last_name: requestData.last_name,
          nickname: requestData.nickname,
          gender: requestData.gender,
          phone: requestData.phone,
          zip_code: requestData.zip_code,
          address: requestData.address,
          profile_image_url: requestData.profile_image_url,
        },
      });

      switch (response.status) {
        case 200:
          // Store tokens in session
          await fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: response.body.accessToken,
              refreshToken: response.body.refreshToken,
            }),
          });

          toast.success("Амжилттай", {
            description: "Бүртгэл амжилттай баталгаажлаа",
          });
          router.push("/");
          break;
        case 400:
          toast.error("Буруу хүсэлт", {
            description: "Мэдээллээ дахин шалгана уу",
          });
          break;
        default:
          toast.error("Алдаа гарлаа");
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
        <Card className="w-full max-w-2xl shadow-xl">
          <CardContent className="flex flex-col items-center gap-y-5 p-10">
            <Image
              src={"/furever-home-dog.jpg"}
              width={200}
              height={200}
              className={cn("h-32 w-80 object-contain")}
              alt="logo"
              priority
            />
            <h2 className="text-2xl font-bold">Бүртгэл баталгаажуулах</h2>
            <p className="text-center text-sm text-muted-foreground">
              Нууц үг үүсгэж, профайлаа бүрэн болгоно уу
            </p>

            <fieldset disabled={isPending} className="w-full space-y-6">
              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold">
                  Нууц үг үүсгэх
                </h3>

                <FormField
                  control={form.control}
                  name="password"
                  required
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нууц үг</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Нууц үг"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_again"
                  required
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нууц үг дахин оруулах</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Нууц үг дахин оруулах"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Profile Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold">
                  Профайл мэдээлэл
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    required
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Нэр</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Нэр" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    required
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Овог</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Овог" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Хоч нэр</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Хоч нэр"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    required
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Хүйс</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Хүйс сонгох" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Эрэгтэй</SelectItem>
                            <SelectItem value="female">Эмэгтэй</SelectItem>
                            <SelectItem value="other">Бусад</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Утас</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Утасны дугаар"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Зип код</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Зип код"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Хаяг</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Хаяг"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profile_image_url"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Профайл зураг URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Профайл зургийн URL"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                className={cn("w-full text-lg", "md:text-base")}
                disabled={isPending}
              >
                {isPending && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Түр хүлээнэ үү..." : "Бүртгэл дуусгах"}
              </Button>
            </fieldset>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default ProfileCreateForm;
