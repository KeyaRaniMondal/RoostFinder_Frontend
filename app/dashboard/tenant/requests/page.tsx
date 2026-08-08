"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMyRentalRequestsWithPayments } from "@/hooks/use-rentals";
import { TenantRequestsList } from "@/components/dashboard/tenant-requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default function TenantRequestsPage() {
  const { user } = useAuth();
  const { data: requests, isLoading } = useMyRentalRequestsWithPayments(user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My requests</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-brand-600" /> All rental requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TenantRequestsList requests={requests} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
