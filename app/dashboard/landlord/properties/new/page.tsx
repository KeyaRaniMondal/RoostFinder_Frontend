"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm } from "@/components/forms/propertyForm";
import { PropertyFormValues } from "@/schemas/property";
import { useCreateProperty } from "@/hooks/usePeoperties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const emptyDefaults: PropertyFormValues = {
    title: "",
    description: "",
    propertyType: "APARTMENT",
    purpose: "RENT",
    price: 0,
    country: "Bangladesh",
    division: "",
    district: "",
    city: "",
    area: "",
    address: "",
    bedrooms: undefined,
    bathrooms: undefined,
    balconies: undefined,
    floor: undefined,
    totalFloors: undefined,
    areaSize: undefined,
    furnished: false,
    images: [""],
    amenities: [],
    status: "ACTIVE",
};

export default function NewPropertyPage() {
    const router = useRouter();
    const createProperty = useCreateProperty();

    const onSubmit = async (values: PropertyFormValues) => {
        const { status: _status, ...payload } = values;
        try {
            await createProperty.mutateAsync(payload as Record<string, unknown>);
            toast.success("Property created", { description: "Your listing is now live." });
            router.push("/dashboard/landlord");
        } catch (error) {
            toast.error("Could not create property", { description: (error as Error).message });
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Add a property</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Listing details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PropertyForm
                        defaultValues={emptyDefaults}
                        submitLabel="Create property"
                        onSubmit={onSubmit}
                        onCancel={() => router.back()}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
