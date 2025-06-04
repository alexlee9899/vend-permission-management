"use client";
import { useRouter } from "next/navigation";
import BusinessList from "@/components/business/BusinessList";
import { useAuth } from "@/context/AuthContext";

export default function AgentPage() {
  const router = useRouter();
  const { token, adminToken, allAgentBusinesses, fetchAllAgentBusinesses } =
    useAuth();

  const handleBusinessClick = (businessId: string) => {
    router.push(`/agent/${businessId}`);
  };

  return (
    <BusinessList
      onBusinessClick={handleBusinessClick}
      token={token ?? ""}
      adminToken={adminToken ?? ""}
      allBusinesses={allAgentBusinesses}
      fetchAllBusinesses={fetchAllAgentBusinesses}
    />
  );
}
