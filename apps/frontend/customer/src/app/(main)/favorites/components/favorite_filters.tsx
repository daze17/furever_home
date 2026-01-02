"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryStates } from "nuqs";
import { z } from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";

import { paginationParsers, favoritesListSPParsers } from "../search_params";

// Form schema matching URL params structure
const filterFormSchema = z.object({
  // Basic filters
  name: z.string().optional(),
  species: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  pet_status: z.array(z.string()).optional(),

  // Behavioral filters
  energy_level: z.array(z.string()).optional(),
  friendliness_with_children: z.array(z.string()).optional(),
  friendliness_with_pets: z.array(z.string()).optional(),
  is_house_trained: z.string().optional(), // "true" | "false" | ""
  training_level: z.array(z.string()).optional(),

  // Age range
  birth_date_from: z.string().optional(),
  birth_date_to: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

export const FavoriteFilters: React.FC = () => {
  // Get current URL state
  const [searchParams, setSearchParams] = useQueryStates({
    ...favoritesListSPParsers,
    ...paginationParsers,
  });

  // Initialize form with current URL values
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      name: searchParams.name || "",
      species: searchParams.species || [],
      size: searchParams.size || [],
      energy_level: searchParams.energy_level || [],
      friendliness_with_children: searchParams.friendliness_with_children || [],
      friendliness_with_pets: searchParams.friendliness_with_pets || [],
      is_house_trained: searchParams.is_house_trained || "",
      training_level: searchParams.training_level || [],
      birth_date_from: searchParams.birth_date_from || "",
      birth_date_to: searchParams.birth_date_to || "",
    },
  });

  // Handle form submission - update URL params
  const onSubmit = (values: FilterFormValues) => {
    // Convert empty values to null (to remove from URL), keep populated values
    const processedValues: Record<string, unknown> = {};

    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedValues[key] = value.length > 0 ? value : null;
      } else if (value === "" || value === undefined || value === null) {
        processedValues[key] = null;
      } else {
        processedValues[key] = value;
      }
    });

    // Update URL params and reset pagination to page 1
    setSearchParams({
      ...processedValues,
      page: 1,
      current_page: 1,
    });
  };

  // Handle reset - clear all filters
  const onReset = () => {
    form.reset({
      name: "",
      species: [],
      size: [],
      pet_status: [],
      energy_level: [],
      friendliness_with_children: [],
      friendliness_with_pets: [],
      is_house_trained: "",
      training_level: [],
      birth_date_from: "",
      birth_date_to: "",
    });

    // Clear URL params except pagination defaults
    setSearchParams({
      name: null,
      species: null,
      size: null,
      pet_status: null,
      energy_level: null,
      friendliness_with_children: null,
      friendliness_with_pets: null,
      is_house_trained: null,
      training_level: null,
      birth_date_from: null,
      birth_date_to: null,
      page: 1,
      current_page: 1,
    });
  };

  // Count active filters for badges
  const speciesCount = form.watch("species")?.length || 0;
  const sizeCount = form.watch("size")?.length || 0;
  const basicCount = speciesCount + sizeCount;

  const energyCount = form.watch("energy_level")?.length || 0;
  const childrenCount = form.watch("friendliness_with_children")?.length || 0;
  const petsCount = form.watch("friendliness_with_pets")?.length || 0;
  const houseTrainedCount = form.watch("is_house_trained") ? 1 : 0;
  const trainingCount = form.watch("training_level")?.length || 0;
  const behaviorCount =
    energyCount + childrenCount + petsCount + houseTrainedCount + trainingCount;

  const birthFromCount = form.watch("birth_date_from") ? 1 : 0;
  const birthToCount = form.watch("birth_date_to") ? 1 : 0;
  const ageCount = birthFromCount + birthToCount;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-white px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-900">Шүүлтүүр</h2>
        </div>

        {/* Scrollable Filter Fields */}
        <div className="flex-1 overflow-y-auto">
          {/* Name Search - Always visible */}
          <div className="border-b px-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Нэрээр хайх</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Тэжээвэр амьтан хайх..."
                      className="border-gray-200 focus:border-[#11D0BC] focus:ring-[#11D0BC]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Accordion
            type="multiple"
            defaultValue={["basic", "behavior", "age"]}
            className="w-full"
          >
            {/* Basic Filters Section */}
            <AccordionItem value="basic" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Үндсэн мэдээлэл
                  </span>
                  {basicCount > 0 && (
                    <span className="rounded-full bg-[#11D0BC] px-2 py-0.5 text-xs font-medium text-white">
                      {basicCount}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  {/* Species Multi-Select */}
                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Төрөл</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              { label: "Нохой", value: "dog" },
                              { label: "Муур", value: "cat" },
                              { label: "Шувуу", value: "bird" },
                              { label: "Загас", value: "fish" },
                              { label: "Бусад", value: "other" },
                            ]}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Бүх төрөл"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Size Multi-Select */}
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Хэмжээ</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              { label: "Жижиг", value: "small" },
                              { label: "Дунд", value: "medium" },
                              { label: "Том", value: "large" },
                            ]}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Бүх хэмжээ"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Behavioral Filters Section */}
            <AccordionItem value="behavior" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Зан төлөв & Сургалт
                  </span>
                  {behaviorCount > 0 && (
                    <span className="rounded-full bg-[#11D0BC] px-2 py-0.5 text-xs font-medium text-white">
                      {behaviorCount}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  {/* Energy Level */}
                  <FormField
                    control={form.control}
                    name="energy_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Эрч хүчний түвшин
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              { label: "Бага", value: "low" },
                              { label: "Дунд", value: "medium" },
                              { label: "Өндөр", value: "high" },
                            ]}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Бүх түвшин"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Friendliness with Children */}
                  <FormField
                    control={form.control}
                    name="friendliness_with_children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Хүүхэдтэй найрсаг байдал
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              { label: "Муу", value: "poor" },
                              { label: "Дунд зэрэг", value: "fair" },
                              { label: "Сайн", value: "good" },
                              { label: "Маш сайн", value: "excellent" },
                            ]}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Бүх түвшин"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Friendliness with Pets */}
                  <FormField
                    control={form.control}
                    name="friendliness_with_pets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Бусад амьтантай найрсаг байдал
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              { label: "Муу", value: "poor" },
                              { label: "Дунд зэрэг", value: "fair" },
                              { label: "Сайн", value: "good" },
                              { label: "Маш сайн", value: "excellent" },
                            ]}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Бүх түвшин"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* House Trained */}
                  <FormField
                    control={form.control}
                    name="is_house_trained"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Гэрийн сургалттай
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value === "any" ? "" : value);
                          }}
                          value={field.value || "any"}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-200">
                              <SelectValue placeholder="Аль ч" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="any">Аль ч</SelectItem>
                            <SelectItem value="true">Тийм</SelectItem>
                            <SelectItem value="false">Үгүй</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Training Level */}
                  <FormField
                    control={form.control}
                    name="training_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Сургалтын түвшин
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              { label: "Байхгүй", value: "none" },
                              { label: "Үндсэн", value: "basic" },
                              { label: "Дундаж", value: "intermediate" },
                              { label: "Дэвшилтэт", value: "advanced" },
                            ]}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Бүх түвшин"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Age Range Filter Section */}
            <AccordionItem value="age" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Насны хязгаар
                  </span>
                  {ageCount > 0 && (
                    <span className="rounded-full bg-[#11D0BC] px-2 py-0.5 text-xs font-medium text-white">
                      {ageCount}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="birth_date_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Төрсөн хойш
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birth_date_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Төрсөн өмнө
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="sticky bottom-0 border-t bg-white px-6 py-4">
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-[#11D0BC] hover:bg-[#0fb8a6]"
            >
              Хайлт хийх
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Бүгдийг арилгах
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
