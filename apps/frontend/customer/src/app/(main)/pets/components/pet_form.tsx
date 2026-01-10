"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { PetResponseBody } from "customer_api";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  Button,
  Form,
  FormControl,
  FormDescription,
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
  Textarea,
  toast,
} from "ui";

import { client } from "@/services/client";

const petFormSchema = z.object({
  name: z.string().min(1, "Нэр шаардлагатай"),
  birth_date: z.string().optional(),
  species: z.enum(["dog", "cat", "bird", "fish", "other"]),
  notes: z.string().optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  pet_status: z.enum(["adopting", "has_owner", "inactive"]),
  pet_extra_information_id: z.string().uuid().optional().or(z.literal("")),
});

type PetFormSchema = z.infer<typeof petFormSchema>;

interface PetFormProps {
  pet?: PetResponseBody;
  mode: "create" | "edit";
}

export function PetForm({ pet, mode }: PetFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<PetFormSchema>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: pet?.name || "",
      birth_date: pet?.birth_date || "",
      species: pet?.species || "dog",
      notes: pet?.notes || "",
      size: pet?.size || undefined,
      pet_status: pet?.pet_status || "adopting",
      pet_extra_information_id: pet?.pet_extra_information_id || "",
    },
  });

  const onSubmit: SubmitHandler<PetFormSchema> = async (data) => {
    setIsPending(true);

    try {
      if (mode === "create") {
        const response = await client.pets.createPet({
          body: {
            name: data.name,
            birth_date: data.birth_date || null,
            species: data.species,
            notes: data.notes || null,
            size: data.size || null,
            pet_status: data.pet_status,
            pet_extra_information: {
              energy_level: null,
              friendliness_with_children: null,
              friendliness_with_pets: null,
              is_house_trained: false,
              training_level: null,
              special_needs: null,
              dietary_restrictions: null,
            },
          },
        });

        if (response.status === 201) {
          toast.success("Амжилттай", {
            description: "Тэжээвэр амьтан амжилттай үүсгэгдлээ",
          });
          router.push("/pets");
        } else {
          toast.error("Алдаа", {
            description: "Тэжээвэр амьтан үүсгэж чадсангүй",
          });
        }
      } else if (mode === "edit" && pet) {
        const response = await client.pets.updatePet({
          params: { id: pet.id },
          body: {
            name: data.name,
            birth_date: data.birth_date || null,
            species: data.species,
            notes: data.notes || null,
            size: data.size || null,
            pet_status: data.pet_status,
            pet_extra_information_id: data.pet_extra_information_id || null,
          },
        });

        if (response.status === 200) {
          toast.success("Амжилттай", {
            description: "Тэжээвэр амьтан амжилттай шинэчлэгдлээ",
          });
          router.push(`/pets/${pet.id}`);
        } else {
          toast.error("Алдаа", {
            description: "Тэжээвэр амьтан шинэчлэж чадсангүй",
          });
        }
      }
    } catch (error) {
      toast.error("Алдаа", {
        description: "Гэнэтийн алдаа гарлаа",
      });
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нэр</FormLabel>
              <FormControl>
                <Input placeholder="Тэжээвэр амьтны нэр оруулна уу" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="species"
            required
            render={({ field }) => (
              <FormItem>
                <FormLabel>Төрөл</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Төрөл сонгох" />
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
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Хэмжээ сонгох" />
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            name="pet_status"
            required
            render={({ field }) => (
              <FormItem>
                <FormLabel>Төлөв</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Төлөв сонгох" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="adopting">
                      Үрчлүүлэх боломжтой
                    </SelectItem>
                    <SelectItem value="has_owner">Эзэнтэй</SelectItem>
                    <SelectItem value="inactive">Идэвхгүй</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тэмдэглэл</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Тэжээвэр амьтны талаарх нэмэлт тэмдэглэл оруулна уу"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pet_extra_information_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нэмэлт мэдээллийн ID</FormLabel>
              <FormControl>
                <Input placeholder="Тэжээвэр амьтны нэмэлт мэдээллийн UUID" {...field} />
              </FormControl>
              <FormDescription>
                Нэмэлт: Тэжээвэр амьтны нэмэлт мэдээллийн бичлэгийн холбоос
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Хадгалж байна..."
              : mode === "create"
                ? "Тэжээвэр амьтан үүсгэх"
                : "Тэжээвэр амьтан шинэчлэх"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Цуцлах
          </Button>
        </div>
      </form>
    </Form>
  );
}
