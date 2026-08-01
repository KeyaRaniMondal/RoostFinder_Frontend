"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm } from "@/components/forms/propertyForm";
import { propertyToFormValues, PropertyFormValues } from "@/schemas/property"
import { useProperty, useUpdateProperty } from "@/hooks/usePeoperties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FullPageSpinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPropertyPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { data: property, isLoading, isError } = useProperty(params.id);
    const updateProperty = useUpdateProperty();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <Card><CardContent><Skeleton className="h-96 w-full" /></CardContent></Card>
            </div>
        );
    }

    if (isError || !property) {
        return (
            <div className="py-16 text-center">
                <h1 className="text-xl font-bold text-slate-900">Property not found</h1>
                <button onClick={() => router.push("/dashboard/landlord")} className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700">
                    Back to dashboard
                </button>
            </div>
        );
    }

    const onSubmit = async (values: PropertyFormValues) => {
        try {
            await updateProperty.mutateAsync({ id: property.id, payload: values as Record<string, unknown> });
            toast.success("Property updated", { description: "Your changes are saved." });
            router.push("/dashboard/landlord");
        } catch (error) {
            toast.error("Could not update property", { description: (error as Error).message });
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Edit property</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{property.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <PropertyForm
                        defaultValues={propertyToFormValues(property)}
                        submitLabel="Save changes"
                        onSubmit={onSubmit}
                        onCancel={() => router.back()}
                        showStatus
                    />
                </CardContent>
            </Card>
        </div>
    );
}
