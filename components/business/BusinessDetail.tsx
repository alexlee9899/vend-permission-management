"use client";
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { Permission, DetailedBusiness } from "@/context/AuthContext";
import PermissionEditDialog from "@/components/business/PermissionEditDialog";
import PermissionDeleteDialog from "@/components/business/PermissionDeleteDialog";
import PermissionAddDialog from "@/components/business/PermissionAddDialog";
import axios, { AxiosError } from "axios";
import { getApiUrl } from "@/config/api";
import { colors, radius, shadows } from "@/styles/theme";

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${colors.text.primary};
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: ${colors.background.main};
  border-radius: ${radius.lg};
  box-shadow: ${shadows.md};
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: ${colors.text.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${colors.border.light};
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const Label = styled.span`
  color: ${colors.text.secondary};
  width: 120px;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: ${colors.text.primary};
  flex-grow: 1;
`;

const PermissionList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PermissionCard = styled.div`
  background: ${colors.background.light};
  padding: 1rem;
  border-radius: ${radius.md};
`;

const PermissionName = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
`;

const PermissionDetails = styled.div`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
`;

const ActionButton = styled.button<{ variant?: "edit" | "delete" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${radius.sm};
  font-size: 0.875rem;
  cursor: pointer;
  background: ${(props) =>
    props.variant === "edit" ? colors.primary.main : colors.danger.main};
  color: white;
  margin-left: 0.5rem;

  &:hover {
    background: ${(props) =>
      props.variant === "edit" ? colors.primary.dark : colors.danger.dark};
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
  background-color: ${colors.secondary.main};
  color: white;
  border: none;
  border-radius: ${radius.md};
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.secondary.dark};
  }
`;

const AgentForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AgentInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.sm};
  flex-grow: 1;
`;

const AgentButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${colors.primary.main};
  color: white;
  border: none;
  border-radius: ${radius.sm};
  cursor: pointer;

  &:hover {
    background-color: ${colors.primary.dark};
  }
`;

const Message = styled.div<{ type: "success" | "error" }>`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: ${radius.sm};
  background-color: ${(props) =>
    props.type === "success" ? colors.success.light : colors.error.light};
  color: ${(props) =>
    props.type === "success" ? colors.success.main : colors.error.main};
`;

interface BusinessDetailProps {
  businessId: string;
  isAdmin: boolean;
}

const BusinessDetail: React.FC<BusinessDetailProps> = ({
  businessId,
  isAdmin,
}) => {
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
  const [agentEmail, setAgentEmail] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

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

    const foundBusiness = allBusinesses.find((b) => b._id === businessId);

    if (foundBusiness) {
      setBusiness(foundBusiness);
    }
  }, [allBusinesses, businessId, isClient]);

  const handleEditSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  const handleDeleteSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  const handleAddSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentEmail) return;

    try {
      const response = await axios.post(getApiUrl("/shop/add_agent_admin"), {
        business_id: businessId,
        email: agentEmail,
        secret: "VEND88SUPERADMIN2025",
      });

      if (response.data.status_code === 200) {
        setMessage({ text: "Agent添加成功", type: "success" });
        setAgentEmail("");
      } else {
        setMessage({
          text: response.data.message || "添加失败",
          type: "error",
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setMessage({
        text: axiosError.response?.data?.message || "添加失败，请稍后重试",
        type: "error",
      });
    }
  };

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
        {isAdmin && (
          <Section>
            <SectionTitle>Agent Management</SectionTitle>
            {message && <Message type={message.type}>{message.text}</Message>}
            <AgentForm onSubmit={handleAddAgent}>
              <AgentInput
                type="email"
                placeholder="Agent Email"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                required
              />
              <AgentButton type="submit">Add Agent</AgentButton>
            </AgentForm>
          </Section>
        )}
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
          businessId={businessId}
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
};

export default BusinessDetail;
