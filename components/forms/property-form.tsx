"use client";

import { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { propertySchema, PropertyFormValues } from "@/schemas/property";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { AmenitySelector } from "@/components/properties/amenity-selector";
import { PROPERTY_PURPOSES, PROPERTY_TYPES, PROPERTY_STATUS } from "@/lib/constants";
import { PropertyStatus } from "@/types";

export function PropertyForm({
  defaultValues,
  submitLabel = "Save property",
  onSubmit,
  onCancel,
  showStatus = false,
}: {
  defaultValues: PropertyFormValues;
  submitLabel?: string;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  onCancel?: () => void;
  showStatus?: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as Resolver<PropertyFormValues>,
    defaultValues,
  });

  const amenities = watch("amenities") ?? [];
  const status = watch("status") ?? "ACTIVE";

  const [imageInputs, setImageInputs] = useState<string[]>(defaultValues.images);

  useEffect(() => {
    setValue("images", imageInputs, { shouldValidate: true, shouldDirty: true });
  }, [imageInputs, setValue]);

  const updateImage = (index: number, value: string) =>
    setImageInputs((prev) => prev.map((v, i) => (i === index ? value : v)));

  const addImage = () => setImageInputs((prev) => [...prev, ""]);

  const removeImage = (index: number) =>
    setImageInputs((prev) => prev.filter((_, i) => i !== index));

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const input = (label: string, name: keyof PropertyFormValues, fieldError?: string) => (
    <div>
      <Label htmlFor={String(name)}>{label}</Label>
      <Input
        id={String(name)}
        aria-invalid={!!fieldError}
        {...(register as any)(name)}
      />
      <FormError message={fieldError} />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Basic information
        </h2>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="e.g. Modern 2BR apartment in Gulshan" {...register("title")} />
          <FormError message={errors.title?.message} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={5}
            placeholder="Describe the property, neighborhood, utilities..."
            {...register("description")}
          />
          <FormError message={errors.description?.message} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="propertyType">Property type</Label>
            <Select id="propertyType" {...register("propertyType")}>
              {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
            <FormError message={errors.propertyType?.message} />
          </div>
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Select id="purpose" {...register("purpose")}>
              {Object.entries(PROPERTY_PURPOSES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
            <FormError message={errors.purpose?.message} />
          </div>
          <div>
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" type="number" step="0.01" placeholder="1200" {...register("price")} />
            <FormError message={errors.price?.message} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Location
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {input("Country", "country", errors.country?.message)}
          {input("Division", "division", errors.division?.message)}
          {input("District", "district", errors.district?.message)}
          {input("City", "city", errors.city?.message)}
          {input("Area", "area", errors.area?.message)}
          <div className="sm:col-span-2">
            {input("Address", "address", errors.address?.message)}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {input("Bedrooms", "bedrooms", errors.bedrooms?.message)}
          {input("Bathrooms", "bathrooms", errors.bathrooms?.message)}
          {input("Balconies", "balconies", errors.balconies?.message)}
          {input("Floor", "floor", errors.floor?.message)}
          {input("Total floors", "totalFloors", errors.totalFloors?.message)}
          {input("Area size (sqft)", "areaSize", errors.areaSize?.message)}
        </div>
        <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-4 py-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            {...register("furnished")}
          />
          <span className="text-sm font-medium text-slate-700">This property is furnished</span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Images
        </h2>
        {imageInputs.map((value, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                placeholder="https://example.com/photo.jpg"
                value={value}
                onChange={(e) => updateImage(index, e.target.value)}
                aria-invalid={!!errors.images?.[index]}
              />
              <FormError message={errors.images?.[index]?.message} />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-0.5 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => removeImage(index)}
              aria-label={`Remove image ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <FormError message={errors.images?.root?.message} />
        <Button
          type="button"
          variant="outline"
          onClick={addImage}
        >
          <Plus className="h-4 w-4" /> Add image URL
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Amenities
        </h2>
        <AmenitySelector
          value={amenities}
          onChange={(next) => setValue("amenities", next, { shouldValidate: true })}
        />
        <FormError message={errors.amenities?.message} />
      </section>

      {showStatus && (
        <section>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={status}
            onChange={(e) => setValue("status", e.target.value as PropertyStatus)}
          >
            {Object.entries(PROPERTY_STATUS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Select>
        </section>
      )}

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <Button type="submit" loading={isSubmitting} size="lg">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="lg" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
