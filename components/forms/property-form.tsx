"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadImages } from "@/lib/api";
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

  const removeImage = (index: number) =>
    setImageInputs((prev) => prev.filter((_, i) => i !== index));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = await uploadImages(Array.from(files));
      setImageInputs((prev) => {
        const next = [...prev.filter((v) => v.trim() !== ""), ...uploaded.map((u) => u.url)];
        return next.slice(0, 12);
      });
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
    } catch (error) {
      toast.error("Upload failed", { description: (error as Error).message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addUrl = () => {
    const value = urlInput.trim();
    if (!value) return;
    if (imageInputs.length >= 12) {
      toast.error("You can add up to 12 images");
      return;
    }
    setImageInputs((prev) => [...prev, value]);
    setUrlInput("");
  };

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
        <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
        <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
        <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
        <label className="flex items-center gap-2.5 rounded-lg border border-border px-4 py-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
            {...register("furnished")}
          />
          <span className="text-sm font-medium text-foreground">This property is furnished</span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Images
        </h2>

        {imageInputs.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {imageInputs.map((url, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg border border-border bg-muted">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-[10px] text-white/80">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading || imageInputs.length >= 12}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload images"}
          </Button>

          <span className="text-xs text-muted-foreground">or</span>

          <div className="flex items-center gap-1.5">
            <Input
              placeholder="Paste image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              className="w-56 text-xs"
            />
            <Button type="button" variant="outline" size="sm" onClick={addUrl} disabled={!urlInput.trim()}>
              <Link2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {imageInputs.length}/12 images. Max 6 files per upload, JPG/PNG/WebP.
        </p>
        <FormError message={errors.images?.root?.message} />
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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

      <div className="flex items-center gap-3 border-t border-border pt-5">
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
