"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCustomerProfileRequestBody } from "customer_api";
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

const schema = CreateCustomerProfileRequestBody;
type Schema = z.infer<typeof schema>;

export const CreateProfileForm: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      nickname: "",
      address: "",
      phone: "",
      profile_image_url: "",
      gender: "other",
      zip_code: "",
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    try {
      setIsPending(true);
      const response = await client.auth.createCustomerProfile({
        body: data,
      });

      switch (response.status) {
        case 201:
          toast.success("Амжилттай", {
            description: "Таны профайл амжилттай үүсгэгдлээ",
          });
          setIsPending(false);
          // Redirect to login page
          router.push("/login");
          break;
        case 400:
          toast.error("Буруу хүсэлт", {
            description: "Мэдээллээ дахин шалгана уу",
          });
          setIsPending(false);
          break;
        default:
          toast.error("Алдаа гарлаа");
          setIsPending(false);
      }
    } catch (error) {
      toast.error("Алдаа", {
        description: "Тодорхойгүй алдаа гарлаа",
      });
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <h2 className="text-2xl font-bold">Профайл үүсгэх</h2>
            <p className="text-sm text-muted-foreground text-center">
              Таны мэдээллийг бөглөж профайлаа бүрэн болгоно уу
            </p>

            <fieldset
              className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
              disabled={isPending}
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нэр *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        disabled={form.formState.isSubmitting}
                        placeholder="Нэр"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Овог *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        disabled={form.formState.isSubmitting}
                        placeholder="Овог"
                      />
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
                        disabled={form.formState.isSubmitting}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хүйс *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
                        placeholder="Профайл зургийн URL"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <Button
              aria-disabled={isPending}
              disabled={isPending}
              className="w-full"
              tabIndex={isPending ? -1 : undefined}
            >
              {isPending ? "Түр хүлээнэ үү..." : "Профайл үүсгэх"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
