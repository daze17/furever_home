"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomerSettingsResponseBody,
  UpdateCustomerSettingsRequestBody,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Switch,
  toast,
} from "ui";

import { client } from "@/services/client";

type SettingsFormProps = {
  initialSettings: CustomerSettingsResponseBody;
};

const SettingsForm: React.FC<SettingsFormProps> = ({ initialSettings }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<UpdateCustomerSettingsRequestBody>({
    resolver: zodResolver(UpdateCustomerSettingsRequestBody),
    defaultValues: {
      receive_email_notification: initialSettings.receive_email_notification,
      receive_sms_notification: initialSettings.receive_sms_notification,
    },
  });

  const onSubmit: SubmitHandler<UpdateCustomerSettingsRequestBody> = async (
    data,
  ) => {
    try {
      setIsPending(true);

      const response = await client.customerSettings.updateCustomerSettings({
        body: data,
      });

      switch (response.status) {
        case 200:
          toast.success("Тохиргоо амжилттай шинэчлэгдлээ");
          router.refresh(); // Refresh server component data
          break;
        case 404:
          toast.error("Тохиргоо олдсонгүй", {
            description: "Тусламжийн төвтэй холбогдоно уу.",
          });
          break;
        case 400:
          toast.error("Буруу тохиргоо", {
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
          "Тохиргоо хадгалах боломжгүй. Интернэт холболтоо шалгана уу.",
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
            <CardTitle>Мэдэгдлийн тохиргоо</CardTitle>
            <CardDescription>
              Furever Home-оос ирэх мэдэгдлийг хэрхэн хүлээн авахаа тохируулна
              уу
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <fieldset disabled={isPending} className="space-y-4">
              <FormField
                control={form.control}
                name="receive_email_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Имэйл мэдэгдэл
                      </FormLabel>
                      <FormDescription>
                        Үрчлэлт, өргөдөл болон чухал мэдээллийг имэйлээр хүлээн
                        авах
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receive_sms_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SMS мэдэгдэл</FormLabel>
                      <FormDescription>
                        Яаралтай мэдээлэл болон сануулгыг мессежээр хүлээн авах
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
              <Button
                type="submit"
                // disabled={isPending || !form.formState.isDirty}
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default SettingsForm;
