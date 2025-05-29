"use client";
import { useParams } from "next/navigation";
import BusinessDetail from "@/components/business/BusinessDetail";

export default function BusinessDetailPage() {
  const params = useParams();
  const businessId = params.id as string;

  return <BusinessDetail businessId={businessId} isAdmin={false} />;
}
