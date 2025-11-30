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
  name: z.string().min(1, "Name is required"),
  birth_date: z.string().optional(),
  species: z.enum(["dog", "cat", "bird", "fish", "other"]),
  notes: z.string().optional(),
  pet_image_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
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
      pet_image_url: pet?.pet_image_url || "",
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
            pet_image_url: data.pet_image_url || null,
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
          toast.success("Success", {
            description: "Pet created successfully",
          });
          router.push("/pets");
        } else {
          toast.error("Error", {
            description: "Failed to create pet",
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
            pet_image_url: data.pet_image_url || null,
            size: data.size || null,
            pet_status: data.pet_status,
            pet_extra_information_id: data.pet_extra_information_id || null,
          },
        });

        if (response.status === 200) {
          toast.success("Success", {
            description: "Pet updated successfully",
          });
          router.push(`/pets/${pet.id}`);
        } else {
          toast.error("Error", {
            description: "Failed to update pet",
          });
        }
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter pet name" {...field} />
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
                <FormLabel>Species</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                <FormLabel>Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
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
                <FormLabel>Birth Date</FormLabel>
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
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="adopting">
                      Available for Adoption
                    </SelectItem>
                    <SelectItem value="has_owner">Has Owner</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pet_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/pet-image.jpg"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the URL of the pet's image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes about the pet"
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
              <FormLabel>Extra Information ID</FormLabel>
              <FormControl>
                <Input placeholder="UUID of pet extra information" {...field} />
              </FormControl>
              <FormDescription>
                Optional: Link to additional pet information record
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : mode === "create"
                ? "Create Pet"
                : "Update Pet"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
