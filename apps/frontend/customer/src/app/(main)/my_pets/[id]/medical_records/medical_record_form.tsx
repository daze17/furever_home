"use client";

import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePetMedicalRecordRequestBody, OwnPetResponseBody } from "customer_api";
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
  Switch,
  Textarea,
  toast,
} from "ui";

import { client } from "@/services/client";

const medicalRecordSchema = CreatePetMedicalRecordRequestBody;

type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;

interface MedicalRecordFormProps {
  petId: number;
  existingRecord: OwnPetResponseBody["pet_medical_records"];
}

export function MedicalRecordForm({
  petId,
  existingRecord,
}: MedicalRecordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!existingRecord;

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      is_spayed_neutered: existingRecord?.is_spayed_neutered ?? false,
      medical_notes: existingRecord?.medical_notes ?? "",
      allergies: existingRecord?.allergies ?? "",
      vaccinations:
        existingRecord?.vaccinations.map((v) => ({
          name: v.name,
          date: v.date,
          notes: v.notes ?? "",
        })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vaccinations",
  });

  const onSubmit = async (values: MedicalRecordFormValues) => {
    setIsSubmitting(true);
    try {
      const body = {
        is_spayed_neutered: values.is_spayed_neutered,
        medical_notes: values.medical_notes || undefined,
        allergies: values.allergies || undefined,
        vaccinations: (values.vaccinations ?? []).map((v) => ({
          name: v.name,
          date: v.date,
          notes: v.notes || null,
        })),
      };

      const response = isEditing
        ? await client.pets.updatePetMedicalRecord({
            params: { id: petId },
            body,
          })
        : await client.pets.createPetMedicalRecord({
            params: { id: petId },
            body,
          });

      if (response.status === 201 || response.status === 200) {
        toast.success(
          isEditing
            ? "Эмнэлгийн бүртгэл амжилттай шинэчлэгдлээ"
            : "Эмнэлгийн бүртгэл амжилттай үүсгэлээ",
        );
        router.push(`/my_pets/${petId}`);
        router.refresh();
      } else {
        toast.error("Алдаа гарлаа");
      }
    } catch {
      toast.error("Алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push(`/my_pets/${petId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Буцах
        </Button>
      </div>

      <h1 className="mb-6 text-2xl font-bold">
        {isEditing
          ? "Эмнэлгийн бүртгэл засах"
          : "Эмнэлгийн бүртгэл нэмэх"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <FormField
                control={form.control}
                name="is_spayed_neutered"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base">
                      Үржил хязгаарласан эсэх
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medical_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Эмнэлгийн тэмдэглэл</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Эмнэлгийн тэмдэглэл..."
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
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Харшил</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Харшлын мэдээлэл..." {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Vaccinations */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Вакцинжуулалт</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", date: "", notes: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Вакцин нэмэх
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Вакцины мэдээлэл байхгүй байна.
                </p>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Вакцин #{index + 1}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`vaccinations.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Нэр</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Жишээ: Rabies, DHPP"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`vaccinations.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Огноо</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`vaccinations.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тэмдэглэл</FormLabel>
                        <FormControl>
                          <Input placeholder="Нэмэлт тэмдэглэл..." {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Шинэчлэх" : "Хадгалах"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
