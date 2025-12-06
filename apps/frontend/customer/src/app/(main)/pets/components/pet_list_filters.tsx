"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryStates } from "nuqs";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  MultiSelect,
} from "ui";

import { petsListSPParsers, paginationParsers } from "../search_params";

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

export const PetListFilters: React.FC = () => {
  // Get current URL state
  const [searchParams, setSearchParams] = useQueryStates({
    ...petsListSPParsers,
    ...paginationParsers,
  });

  // Initialize form with current URL values
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      name: searchParams.name || "",
      species: searchParams.species || [],
      size: searchParams.size || [],
      pet_status: searchParams.pet_status || [],
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
    const processedValues: Record<string, any> = {};

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        {/* Scrollable Filter Fields */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Name Search */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search by name</FormLabel>
                  <FormControl>
                    <Input placeholder="Search pets..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Basic Filters Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Basic Info
              </h3>

              {/* Species Multi-Select */}
              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Species</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { label: "Dog", value: "dog" },
                          { label: "Cat", value: "cat" },
                          { label: "Bird", value: "bird" },
                          { label: "Fish", value: "fish" },
                          { label: "Other", value: "other" },
                        ]}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="All species"
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
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { label: "Small", value: "small" },
                          { label: "Medium", value: "medium" },
                          { label: "Large", value: "large" },
                        ]}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="All sizes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pet Status Multi-Select */}
              <FormField
                control={form.control}
                name="pet_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[
                          {
                            label: "Available for Adoption",
                            value: "adopting",
                          },
                          { label: "Has Owner", value: "has_owner" },
                          { label: "Inactive", value: "inactive" },
                        ]}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="All statuses"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Behavioral Filters Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Behavior & Training
              </h3>

              {/* Energy Level */}
              <FormField
                control={form.control}
                name="energy_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy Level</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { label: "Low", value: "low" },
                          { label: "Medium", value: "medium" },
                          { label: "High", value: "high" },
                        ]}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Any level"
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
                    <FormLabel>Friendliness with Children</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { label: "Poor", value: "poor" },
                          { label: "Fair", value: "fair" },
                          { label: "Good", value: "good" },
                          { label: "Excellent", value: "excellent" },
                        ]}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Any level"
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
                    <FormLabel>Friendliness with Pets</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { label: "Poor", value: "poor" },
                          { label: "Fair", value: "fair" },
                          { label: "Good", value: "good" },
                          { label: "Excellent", value: "excellent" },
                        ]}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Any level"
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
                    <FormLabel>House Trained</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === "any" ? "" : value);
                      }}
                      value={field.value || "any"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
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
                    <FormLabel>Training Level</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { label: "None", value: "none" },
                          { label: "Basic", value: "basic" },
                          { label: "Intermediate", value: "intermediate" },
                          { label: "Advanced", value: "advanced" },
                        ]}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Any level"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Age Range Filter Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Age Range
              </h3>

              <FormField
                control={form.control}
                name="birth_date_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Born After</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Born Before</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons Footer */}
        <div className="border-t bg-background px-6 py-4">
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full"
            >
              Reset All
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
