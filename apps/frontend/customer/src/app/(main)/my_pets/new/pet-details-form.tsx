"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
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
  Switch,
  Textarea,
  toast,
} from "ui";

import { client } from "@/services/client";

interface UploadedImage {
  url: string;
  preview: string;
}

interface PetDetailsFormProps {
  uploadedImages: UploadedImage[];
  onBack: () => void;
  onSuccess: () => void;
}

const petFormSchema = z.object({
  name: z.string().min(1, "Нэр шаардлагатай"),
  birth_date: z.string().optional(),
  species: z.enum(["dog", "cat", "bird", "fish", "other"]),
  notes: z.string().optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  energy_level: z.enum(["low", "medium", "high"]).optional(),
  friendliness_with_children: z
    .enum(["poor", "fair", "good", "excellent"])
    .optional(),
  friendliness_with_pets: z
    .enum(["poor", "fair", "good", "excellent"])
    .optional(),
  is_house_trained: z.boolean().default(false),
  training_level: z
    .enum(["none", "basic", "intermediate", "advanced"])
    .optional(),
  special_needs: z.string().optional(),
  dietary_restrictions: z.string().optional(),
});

type PetFormSchema = z.infer<typeof petFormSchema>;

export function PetDetailsForm({
  uploadedImages,
  onBack,
  onSuccess,
}: PetDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PetFormSchema>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: "dog",
      is_house_trained: false,
    },
  });

  const onSubmit: SubmitHandler<PetFormSchema> = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await client.pets.createPet({
        body: {
          name: data.name,
          birth_date: data.birth_date || null,
          species: data.species,
          notes: data.notes || null,
          size: data.size || null,
          pet_status: "has_owner",
          pet_extra_information: {
            energy_level: data.energy_level || null,
            friendliness_with_children: data.friendliness_with_children || null,
            friendliness_with_pets: data.friendliness_with_pets || null,
            is_house_trained: data.is_house_trained,
            training_level: data.training_level || null,
            special_needs: data.special_needs || null,
            dietary_restrictions: data.dietary_restrictions || null,
          },
          image_urls:
            uploadedImages.length > 0
              ? uploadedImages.map((img) => img.url)
              : undefined,
        },
      });

      if (response.status !== 201) {
        toast.error("Алдаа", {
          description: "Тэжээвэр амьтан үүсгэж чадсангүй",
        });
        return;
      }

      toast.success("Амжилттай", {
        description: "Тэжээвэр амьтан амжилттай үүсгэгдлээ",
      });
      onSuccess();
    } catch (error) {
      toast.error("Алдаа", {
        description: "Гэнэтийн алдаа гарлаа",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Uploaded images preview */}
        {uploadedImages.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                Байршуулсан зургууд ({uploadedImages.length})
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative h-16 w-16 flex-shrink-0">
                    <img
                      src={img.preview}
                      alt={`Uploaded ${index + 1}`}
                      className="h-full w-full rounded object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                        1
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-lg font-semibold">Үндсэн мэдээлэл</h2>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нэр *</FormLabel>
                    <FormControl>
                      <Input placeholder="Нэр оруулна уу" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Төрөл *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Сонгох" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Нохой</SelectItem>
                          <SelectItem value="cat">Муур</SelectItem>
                          <SelectItem value="bird">Шувуу</SelectItem>
                          <SelectItem value="fish">Загас</SelectItem>
                          <SelectItem value="other">Бусад</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Хэмжээ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Сонгох" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Жижиг</SelectItem>
                          <SelectItem value="medium">Дунд</SelectItem>
                          <SelectItem value="large">Том</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Төрсөн огноо</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тэмдэглэл</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Нэмэлт тэмдэглэл"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-lg font-semibold">Зан төлөв</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="energy_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Энергийн түвшин</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Сонгох" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Бага</SelectItem>
                          <SelectItem value="medium">Дунд</SelectItem>
                          <SelectItem value="high">Өндөр</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="training_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сургалтын түвшин</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Сонгох" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Байхгүй</SelectItem>
                          <SelectItem value="basic">Анхан шат</SelectItem>
                          <SelectItem value="intermediate">Дунд шат</SelectItem>
                          <SelectItem value="advanced">Ахисан шат</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="friendliness_with_children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Хүүхэдтэй харьцах</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Сонгох" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="poor">Муу</SelectItem>
                          <SelectItem value="fair">Дунд зэрэг</SelectItem>
                          <SelectItem value="good">Сайн</SelectItem>
                          <SelectItem value="excellent">Маш сайн</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="friendliness_with_pets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Бусад амьтадтай харьцах</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Сонгох" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="poor">Муу</SelectItem>
                          <SelectItem value="fair">Дунд зэрэг</SelectItem>
                          <SelectItem value="good">Сайн</SelectItem>
                          <SelectItem value="excellent">Маш сайн</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_house_trained"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <FormLabel>Гэрт сургагдсан</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Буцах
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#11D0BC] hover:bg-[#0fb8a6]"
          >
            {isSubmitting ? (
              <div>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Үүсгэж байна...
              </div>
            ) : (
              "Тэжээвэр амьтан үүсгэх"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
