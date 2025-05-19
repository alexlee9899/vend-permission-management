"use client";
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { Permission } from "@/context/AuthContext";
import { DetailedBusiness } from "@/context/AuthContext";
import PermissionEditDialog from "@/components/business/PermissionEditDialog";
import PermissionDeleteDialog from "@/components/business/PermissionDeleteDialog";
import PermissionAddDialog from "@/components/business/PermissionAddDialog";
import { usePathname } from "next/navigation";

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const Label = styled.span`
  color: #666;
  width: 120px;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: #333;
  flex-grow: 1;
`;

const PermissionList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PermissionCard = styled.div`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
`;

const PermissionName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const PermissionDetails = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ActionButton = styled.button<{ variant?: "edit" | "delete" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${(props) => (props.variant === "edit" ? "#0070f3" : "#dc2626")};
  color: white;
  margin-left: 0.5rem;

  &:hover {
    background: ${(props) =>
      props.variant === "edit" ? "#0051b3" : "#b91c1c"};
  }
`;

const PermissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

export default function BusinessDetail() {
  const pathname = usePathname();
  const { allBusinesses, adminToken, fetchAllBusinesses } = useAuth();
  const [business, setBusiness] = useState<DetailedBusiness | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [deletingPermissionId, setDeletingPermissionId] = useState<
    string | null
  >(null);
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && adminToken && !dataFetched) {
      fetchAllBusinesses();
      setDataFetched(true);
    }
  }, [isClient, adminToken, dataFetched, fetchAllBusinesses]);

  useEffect(() => {
    if (!isClient) return;

    const id = pathname.split("/").pop();
    const foundBusiness = allBusinesses.find((b) => b._id === id);

    if (foundBusiness) {
      setBusiness(foundBusiness);
    }
  }, [allBusinesses, pathname, isClient]);

  const handleEditSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  const handleDeleteSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  const handleAddSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  if (!business) {
    return (
      <Container>
        <Title>Loading...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{business.name}</Title>
      <Card>
        <Section>
          <SectionTitle>Basic Information</SectionTitle>
          <InfoRow>
            <Label>Business ID:</Label>
            <Value>{business._id}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Owner ID:</Label>
            <Value>{business.owner_id}</Value>
          </InfoRow>
        </Section>

        <Section>
          <SectionTitle>Permission Information</SectionTitle>
          <PermissionList>
            {business.permissions && business.permissions.length > 0 ? (
              business.permissions.map((permission: Permission) => (
                <PermissionCard key={permission._id}>
                  <PermissionHeader>
                    <PermissionName>{permission.name}</PermissionName>
                    <div>
                      <ActionButton
                        variant="edit"
                        onClick={() => setEditingPermission(permission)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        variant="delete"
                        onClick={() => setDeletingPermissionId(permission._id)}
                      >
                        Delete
                      </ActionButton>
                    </div>
                  </PermissionHeader>
                  <PermissionDetails>
                    <InfoRow>
                      <Label>Permission Level:</Label>
                      <Value>{permission.level}</Value>
                    </InfoRow>
                    <InfoRow>
                      <Label>Expiration Time:</Label>
                      <Value>{permission.expire}</Value>
                    </InfoRow>
                  </PermissionDetails>
                </PermissionCard>
              ))
            ) : (
              <PermissionDetails>No permission information</PermissionDetails>
            )}
          </PermissionList>
          <AddButton onClick={() => setIsAddingPermission(true)}>
            Add Permission
          </AddButton>
        </Section>
      </Card>

      {editingPermission && (
        <PermissionEditDialog
          permission={editingPermission}
          onClose={() => setEditingPermission(null)}
          onSuccess={handleEditSuccess}
          adminToken={adminToken || ""}
        />
      )}

      {deletingPermissionId && (
        <PermissionDeleteDialog
          permissionId={deletingPermissionId}
          onClose={() => setDeletingPermissionId(null)}
          onSuccess={handleDeleteSuccess}
          adminToken={adminToken || ""}
        />
      )}

      {isAddingPermission && (
        <PermissionAddDialog
          businessId={business._id}
          existingPermissions={
            business.permissions ? business.permissions.map((p) => p.name) : []
          }
          onClose={() => setIsAddingPermission(false)}
          onSuccess={handleAddSuccess}
          adminToken={adminToken || ""}
        />
      )}
    </Container>
  );
}
