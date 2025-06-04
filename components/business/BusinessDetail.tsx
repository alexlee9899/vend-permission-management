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
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/zh_en";

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 2.5rem 0;
  background: ${colors.background.gradient};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div`
  background: ${colors.background.glass};
  border-radius: ${radius.xl};
  box-shadow: ${shadows.xl};
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1.5px solid ${colors.border.gradient};
`;

const Title = styled.h1`
  color: ${colors.primary.main};
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-align: center;
  background: ${colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
  background: ${colors.background.light};
  border-radius: ${radius.lg};
  box-shadow: ${shadows.md};
  padding: 2rem 1.5rem;
  animation: fadeIn 0.5s ease-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SectionTitle = styled.h2`
  color: ${colors.primary.main};
  font-size: 1.5rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid ${colors.border.gradient};
  background: ${colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
  padding: 0.8rem;
  background: ${colors.background.light};
  border-radius: ${radius.md};
  transition: all 0.3s ease;
  box-shadow: ${shadows.sm};
  &:hover {
    background: ${colors.background.main};
    transform: translateX(5px);
  }
`;

const Label = styled.span`
  color: ${colors.text.secondary};
  width: 150px;
  flex-shrink: 0;
  font-weight: 600;
`;

const Value = styled.span`
  color: ${colors.text.primary};
  flex-grow: 1;
`;

const PermissionList = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PermissionCard = styled.div`
  background: ${colors.background.glass};
  padding: 1.5rem;
  border-radius: ${radius.lg};
  box-shadow: ${shadows.md};
  transition: all 0.3s ease;
  border: 1.5px solid ${colors.border.gradient};
  backdrop-filter: blur(8px) saturate(160%);
  -webkit-backdrop-filter: blur(8px) saturate(160%);
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: ${shadows.lg};
    border-color: ${colors.primary.light};
  }
`;

const PermissionName = styled.div`
  font-weight: 700;
  color: ${colors.primary.main};
  font-size: 1.2rem;
  margin-bottom: 1rem;
  background: ${colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PermissionDetails = styled.div`
  color: ${colors.text.secondary};
  font-size: 1rem;
  line-height: 1.6;
`;

const ActionButton = styled.button<{ variant?: "edit" | "delete" }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: ${radius.lg};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: ${(props) =>
    props.variant === "edit" ? colors.primary.gradient : colors.danger.main};
  color: white;
  margin-left: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  box-shadow: ${shadows.sm};
  &:hover {
    background: ${(props) =>
      props.variant === "edit" ? colors.primary.light : colors.danger.dark};
    transform: translateY(-2px) scale(1.04);
    box-shadow: ${shadows.md};
  }
`;

const AddButton = styled.button`
  padding: 1rem 2rem;
  background: ${colors.secondary.gradient};
  color: white;
  border: none;
  border-radius: ${radius.xl};
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  box-shadow: ${shadows.md};
  &:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: ${shadows.lg};
    background: ${colors.secondary.light};
  }
`;

const AgentForm = styled.form`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: ${colors.background.glass};
  padding: 1.5rem;
  border-radius: ${radius.lg};
  box-shadow: ${shadows.sm};
  border: 1.5px solid ${colors.border.gradient};
  backdrop-filter: blur(8px) saturate(160%);
  -webkit-backdrop-filter: blur(8px) saturate(160%);
`;

const AgentInput = styled.input`
  padding: 1rem 1.2rem;
  border: 1.5px solid ${colors.border.main};
  border-radius: ${radius.lg};
  font-size: 1.1rem;
  background: ${colors.background.light};
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  font-weight: 500;
  &:focus {
    outline: none;
    border-color: ${colors.primary.light};
    box-shadow: 0 0 0 4px ${colors.primary.light}40;
    background: #fff;
  }
`;

const AgentButton = styled.button`
  padding: 1rem 2rem;
  background: ${colors.primary.gradient};
  color: white;
  border: none;
  border-radius: ${radius.lg};
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  box-shadow: ${shadows.sm};
  &:hover {
    background: ${colors.primary.light};
    transform: translateY(-2px) scale(1.04);
    box-shadow: ${shadows.md};
  }
`;

const Message = styled.div<{ type: "success" | "error" }>`
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: ${radius.lg};
  background-color: ${(props) =>
    props.type === "success" ? colors.success.light : colors.error.light};
  color: ${(props) =>
    props.type === "success" ? colors.success.main : colors.error.main};
  font-weight: 700;
  animation: slideIn 0.3s ease-out;
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PermissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AgentList = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const AgentCard = styled.div`
  background: ${colors.background.glass};
  padding: 1.5rem;
  border-radius: ${radius.lg};
  box-shadow: ${shadows.md};
  transition: all 0.3s ease;
  border: 1.5px solid ${colors.border.gradient};
  backdrop-filter: blur(8px) saturate(160%);
  -webkit-backdrop-filter: blur(8px) saturate(160%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: ${shadows.lg};
    border-color: ${colors.primary.light};
  }
`;

const AgentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AgentName = styled.div`
  font-weight: 700;
  color: ${colors.primary.main};
  font-size: 1.2rem;
  background: ${colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AgentEmail = styled.div`
  color: ${colors.text.secondary};
  font-size: 1rem;
`;

const AgentId = styled.div`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  opacity: 0.7;
`;

const DeleteButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: ${radius.lg};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: ${colors.danger.main};
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  box-shadow: ${shadows.sm};
  &:hover {
    background: ${colors.danger.dark};
    transform: translateY(-2px) scale(1.04);
    box-shadow: ${shadows.md};
  }
`;

interface Agent {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface BusinessDetailProps {
  businessId: string;
  isAdmin: boolean;
}

const BusinessDetail: React.FC<BusinessDetailProps> = ({
  businessId,
  isAdmin,
}) => {
  const { allBusinesses, adminToken, fetchAllBusinesses } = useAuth();
  const { lang } = useLanguage();
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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [agentMessage, setAgentMessage] = useState<{
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

  useEffect(() => {
    if (isClient && businessId) {
      fetchBusinessAgents();
    }
  }, [isClient, businessId]);

  const fetchBusinessAgents = async () => {
    setIsLoadingAgents(true);
    try {
      const response = await axios.post(
        "https://dev.vend88.com/shop/get_business_agent",
        {
          query: { _id: businessId },
          secret: "VEND88SUPERADMIN2025",
        }
      );

      if (response.data.status_code === 200) {
        setAgents(response.data.agents || []);
      } else {
        setAgentMessage({
          text: "无法获取代理列表",
          type: "error",
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setAgentMessage({
        text: axiosError.response?.data?.message || "获取代理列表时出错",
        type: "error",
      });
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const response = await axios.post(
        "https://dev.vend88.com/shop/remove_agent",
        {
          secret: "VEND88SUPERADMIN2025",
          agent_id: agentId,
          business_id: businessId,
        }
      );

      if (response.data.status_code === 200) {
        setAgentMessage({
          text: "代理删除成功",
          type: "success",
        });
        // 重新获取代理列表
        fetchBusinessAgents();
      } else {
        setAgentMessage({
          text: response.data.message || "删除代理失败",
          type: "error",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setAgentMessage({
        text: axiosError.response?.data?.message || "删除代理失败",
        type: "error",
      });
    }
  };

  const handleEditSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  const handleDeleteSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);

  const handleAddSuccess = useCallback(() => {
    fetchAllBusinesses();
  }, [fetchAllBusinesses]);
  console.log("isAdmin", isAdmin);
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
        setMessage({ text: dict.detail.addSuccess[lang], type: "success" });
        setAgentEmail("");
        // 重新获取代理列表
        fetchBusinessAgents();
      } else {
        setMessage({
          text: response.data.message || dict.detail.addFailed[lang],
          type: "error",
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setMessage({
        text: axiosError.response?.data?.message || dict.detail.addFailed[lang],
        type: "error",
      });
    }
  };

  if (!business) {
    return (
      <Container>
        <Title>{dict.system.loading[lang]}</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{business.name}</Title>
      <Card>
        <Section>
          <SectionTitle>{dict.detail.basicInfo[lang]}</SectionTitle>
          <InfoRow>
            <Label>{dict.business.businessId[lang]}:</Label>
            <Value>{business._id}</Value>
          </InfoRow>
          <InfoRow>
            <Label>{dict.business.ownerId[lang]}:</Label>
            <Value>{business.owner_id}</Value>
          </InfoRow>
        </Section>

        <Section>
          <SectionTitle>{dict.detail.permissionInfo[lang]}</SectionTitle>
          <PermissionList>
            {business.permissions && business.permissions.length > 0 ? (
              business.permissions.map((permission: Permission) => (
                <PermissionCard key={permission._id}>
                  <PermissionHeader>
                    <PermissionName>{permission.name}</PermissionName>
                    {isAdmin && (
                      <div>
                        <ActionButton
                          variant="edit"
                          onClick={() => setEditingPermission(permission)}
                        >
                          {dict.nav.edit[lang]}
                        </ActionButton>
                        <ActionButton
                          variant="delete"
                          onClick={() =>
                            setDeletingPermissionId(permission._id)
                          }
                        >
                          {dict.nav.delete[lang]}
                        </ActionButton>
                      </div>
                    )}
                  </PermissionHeader>
                  <PermissionDetails>
                    <InfoRow>
                      <Label>{dict.business.permissionLevel[lang]}:</Label>
                      <Value>{permission.level}</Value>
                    </InfoRow>
                    <InfoRow>
                      <Label>{dict.business.expireTime[lang]}:</Label>
                      <Value>{permission.expire}</Value>
                    </InfoRow>
                  </PermissionDetails>
                </PermissionCard>
              ))
            ) : (
              <PermissionDetails>
                {dict.business.noPermissions[lang]}
              </PermissionDetails>
            )}
          </PermissionList>
          {isAdmin && (
            <AddButton onClick={() => setIsAddingPermission(true)}>
              {dict.detail.addPermission[lang]}
            </AddButton>
          )}
        </Section>
        {isAdmin && (
          <Section>
            <SectionTitle>{dict.detail.agentManagement[lang]}</SectionTitle>
            {message && <Message type={message.type}>{message.text}</Message>}
            <AgentForm onSubmit={handleAddAgent}>
              <AgentInput
                type="email"
                placeholder={dict.detail.agentEmail[lang]}
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                required
              />
              <AgentButton type="submit">
                {dict.detail.addAgent[lang]}
              </AgentButton>
            </AgentForm>

            <SectionTitle style={{ marginTop: "2rem" }}>代理列表</SectionTitle>
            {agentMessage && (
              <Message type={agentMessage.type}>{agentMessage.text}</Message>
            )}

            {isLoadingAgents ? (
              <div className="text-center p-4">加载代理列表中...</div>
            ) : (
              <AgentList>
                {agents.length > 0 ? (
                  agents.map((agent) => (
                    <AgentCard key={agent._id}>
                      <AgentInfo>
                        <AgentName>
                          {agent.first_name} {agent.last_name}
                        </AgentName>
                        <AgentEmail>{agent.email}</AgentEmail>
                        <AgentId>ID: {agent._id}</AgentId>
                      </AgentInfo>
                      <DeleteButton
                        onClick={() => handleDeleteAgent(agent._id)}
                      >
                        删除
                      </DeleteButton>
                    </AgentCard>
                  ))
                ) : (
                  <InfoRow>暂无代理</InfoRow>
                )}
              </AgentList>
            )}
          </Section>
        )}
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
