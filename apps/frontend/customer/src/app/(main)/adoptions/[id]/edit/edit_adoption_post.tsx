"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OwnAdoptionPostResponseBody } from "customer_api";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "ui";

import ImageWithFallback from "@/components/image_with_fallback";
import { client } from "@/services/client";
import { speciesEmoji, speciesLabel } from "@/utils/pet_labels";

const formSchema = z.object({
  price: z.string().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  notes: z.string().optional(),
  post_status: z.enum(["active", "inactive", "pending"]),
});

type FormValues = z.infer<typeof formSchema>;

export const EditAdoptionPost: React.FC<{
  post: OwnAdoptionPostResponseBody;
}> = ({ post }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pet = post.pet;

  const primaryImage =
    pet.images?.find((img) => img.is_primary)?.image_url ||
    pet.images?.[0]?.image_url ||
    "/furever-home-dog.jpg";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: post.price?.toString() || "",
      address: post.address || "",
      contact: post.contact || "",
      notes: post.notes || "",
      post_status: post.post_status,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await client.adoptionPosts.updateAdoptionPost({
        params: { id: post.id },
        body: {
          price: data.price ? parseInt(data.price, 10) : null,
          address: data.address || null,
          contact: data.contact || null,
          notes: data.notes || null,
          post_status: data.post_status,
        },
      });

      if (response.status === 200) {
        router.push(`/adoptions/${post.id}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update adoption post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Pet Info Card (Read-only) */}
        <Card>
          <CardHeader>
            <CardTitle>Тэжээвэр амьтан</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={primaryImage}
                alt={pet.name}
                height={80}
                width={80}
                fallbackSrc="/furever-home-dog.jpg"
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div>
                <p className="text-lg font-medium text-gray-900">{pet.name}</p>
                <p className="text-sm text-gray-500">
                  {speciesEmoji[pet.species]} {speciesLabel[pet.species]}
                </p>
              </div>
            </div>
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
              name="post_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Зарын төлөв</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Төлөв сонгох" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Идэвхтэй</SelectItem>
                      <SelectItem value="inactive">Идэвхгүй</SelectItem>
                      <SelectItem value="pending">Хүлээгдэж буй</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Идэвхгүй болгосноор зар олон нийтэд харагдахгүй болно
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            onClick={() => router.push(`/adoptions/${post.id}`)}
          >
            Цуцлах
          </Button>
          <Button
            type="submit"
            className="bg-[#11D0BC] hover:bg-[#0fb8a6]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
