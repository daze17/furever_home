"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetsListResponseBody } from "customer_api";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "ui";

import ImageWithFallback from "@/components/image_with_fallback";
import { client } from "@/services/client";

const formSchema = z.object({
  pet_id: z.number().min(1, "Тэжээвэр амьтан сонгоно уу"),
  price: z.string().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewAdoptionPost: React.FC<{
  availablePets: PetsListResponseBody;
}> = ({ availablePets }) => {
  const router = useRouter();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pet_id: 0,
      price: "",
      address: "",
      contact: "",
      notes: "",
    },
  });

  const speciesEmoji = {
    dog: "🐕",
    cat: "🐈",
    bird: "🐦",
    fish: "🐠",
    other: "🐾",
  };

  const speciesLabel = {
    dog: "Нохой",
    cat: "Муур",
    bird: "Шувуу",
    fish: "Загас",
    other: "Бусад",
  };

  const handlePetSelect = (petId: number) => {
    setSelectedPetId(petId);
    form.setValue("pet_id", petId);

    // Auto-fill notes from pet if available
    const selectedPet = availablePets.find((pet) => pet.id === petId);
    if (selectedPet?.notes) {
      form.setValue("notes", selectedPet.notes);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await client.adoptionPosts.createAdoptionPost({
        body: {
          pet_id: data.pet_id,
          price: data.price ? parseInt(data.price, 10) : null,
          address: data.address || null,
          contact: data.contact || null,
          notes: data.notes || null,
        },
      });

      if (response.status === 201) {
        router.push("/adoptions");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create adoption post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (availablePets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <span className="text-3xl">🐾</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Үрчлүүлэх боломжтой тэжээвэр амьтан байхгүй байна
            </h3>
            <p className="mt-2 text-gray-500">
              Эхлээд тэжээвэр амьтан нэмнэ үү
            </p>
            <Button
              className="mt-4 bg-[#11D0BC] hover:bg-[#0fb8a6]"
              onClick={() => router.push("/my_pets/new")}
            >
              Тэжээвэр амьтан нэмэх
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Pet Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Тэжээвэр амьтан сонгох</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="pet_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {availablePets.map((pet) => (
                        <div
                          key={pet.id}
                          onClick={() => handlePetSelect(pet.id)}
                          className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                            selectedPetId === pet.id
                              ? "border-[#11D0BC] bg-[#11D0BC]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <ImageWithFallback
                            src="/furever-home-dog.jpg"
                            alt={pet.name}
                            height={100}
                            width={100}
                            fallbackSrc="/furever-home-dog.jpg"
                            className="mx-auto h-24 w-24 rounded-lg object-cover"
                          />
                          <div className="mt-2 text-center">
                            <p className="font-medium text-gray-900">
                              {pet.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {speciesEmoji[pet.species]}{" "}
                              {speciesLabel[pet.species]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Adoption Post Details */}
        <Card>
          <CardHeader>
            <CardTitle>Зарын мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Үнэ (₮)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Үнэ оруулах (заавал биш)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Үнэгүй үрчлүүлэх бол хоосон орхино уу
                  </FormDescription>
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
                      placeholder="Хаяг оруулах (заавал биш)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Холбоо барих</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Утас эсвэл имэйл (заавал биш)"
                      {...field}
                    />
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
                  <FormLabel>Нэмэлт тайлбар</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Үрчлүүлэх шалтгаан, нөхцөл гэх мэт..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/adoptions")}
          >
            Цуцлах
          </Button>
          <Button
            type="submit"
            className="bg-[#11D0BC] hover:bg-[#0fb8a6]"
            disabled={isSubmitting || !selectedPetId}
          >
            {isSubmitting ? "Хадгалж байна..." : "Зар нэмэх"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
