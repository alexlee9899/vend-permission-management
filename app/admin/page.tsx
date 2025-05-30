"use client";
import { useRouter } from "next/navigation";
import BusinessList from "@/components/business/BusinessList";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const router = useRouter();
  const { token, adminToken, allBusinesses, fetchAllBusinesses } = useAuth();

  const handleBusinessClick = (businessId: string) => {
    router.push(`/admin/${businessId}`);
  };

  return (
    <BusinessList
      onBusinessClick={handleBusinessClick}
      token={token ?? ""}
      adminToken={adminToken ?? ""}
      allBusinesses={allBusinesses}
      fetchAllBusinesses={fetchAllBusinesses}
    />
  );
}
