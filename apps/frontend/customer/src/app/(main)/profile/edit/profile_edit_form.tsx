"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomerProfileResponseBody,
  UpdateCustomerProfileRequestBody,
} from "customer_api";
import { useRouter } from "next/navigation";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

import { client } from "@/services/client";

import ImagePreview from "./image_preview";

const ProfileEditForm: React.FC<{
  initialProfile: CustomerProfileResponseBody;
}> = ({ initialProfile }) => {
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<UpdateCustomerProfileRequestBody>({
    resolver: zodResolver(UpdateCustomerProfileRequestBody),
    defaultValues: {
      first_name: initialProfile.first_name,
      last_name: initialProfile.last_name,
      nickname: initialProfile.nickname ?? "",
      phone: initialProfile.phone ?? "",
      address: initialProfile.address ?? "",
      zip_code: initialProfile.zip_code ?? "",
      gender: initialProfile.gender,
      profile_image_url: initialProfile.profile_image_url ?? "",
    },
  });

  const profileImageUrl = form.watch("profile_image_url");

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await client.customer.uploadProfileImage({
        body: formData,
      });

      if (response.status === 201) {
        form.setValue("profile_image_url", response.body);
        toast.success("Зураг амжилттай оруулагдлаа");
      } else {
        toast.error("Зураг оруулахад алдаа гарлаа");
      }
    } catch (error) {
      toast.error("Зураг оруулахад алдаа гарлаа", {
        description: "Дахин оролдоно уу.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onSubmit: SubmitHandler<UpdateCustomerProfileRequestBody> = async (
    data,
  ) => {
    try {
      setIsPending(true);

      const response = await client.customer.updateCustomerProfile({
        body: data,
      });

      switch (response.status) {
        case 200:
          toast.success("Профайл амжилттай шинэчлэгдлээ");
          router.push("/profile");
          break;
        case 404:
          toast.error("Хэрэглэгч олдсонгүй", {
            description: "Тусламжийн төвтэй холбогдоно уу.",
          });
          break;
        case 400:
          toast.error("Буруу мэдээлэл", {
            description: "Оруулсан мэдээллээ шалгана уу.",
          });
          break;
        default:
          toast.error("Алдаа гарлаа", {
            description: "Дахин оролдоно уу.",
          });
      }
    } catch (error) {
      toast.error("Сүлжээний алдаа", {
        description:
          "Профайл хадгалах боломжгүй. Интернэт холболтоо шалгана уу.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Хувийн мэдээлэл</CardTitle>
            <CardDescription>
              Та өөрийн хувийн мэдээллийг энд засварлаж болно
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <fieldset disabled={isPending} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="profile_image_url"
                  render={() => (
                    <FormItem className="col-span-2">
                      <FormLabel>Профайл зураг</FormLabel>
                      <div className="flex items-center gap-4">
                        <ImagePreview
                          imageUrl={profileImageUrl}
                          size={80}
                          onClick={() => fileInputRef.current?.click()}
                          isUploading={isUploading}
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isPending || isUploading}
                        />
                        <span className="text-sm text-muted-foreground">
                          Зураг солихын тулд дээр дарна уу
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Овог</FormLabel>
                      <FormControl>
                        <Input placeholder="Овог" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нэр</FormLabel>
                      <FormControl>
                        <Input placeholder="Нэр" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хоч</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Хоч (заавал биш)"
                        {...field}
                        value={field.value ?? ""}
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
                    <FormLabel>Утасны дугаар</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Утасны дугаар"
                        {...field}
                        value={field.value ?? ""}
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
                  <FormItem>
                    <FormLabel>Хаяг</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Хаяг"
                        {...field}
                        value={field.value ?? ""}
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
                    <FormLabel>Шуудангийн код</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Зип код"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Цуцлах
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
