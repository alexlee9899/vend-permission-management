import React from "react";
import styled from "styled-components";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "@/config/api";

interface PermissionDeleteDialogProps {
  permissionId: string;
  onClose: () => void;
  onSuccess: () => void;
  adminToken: string;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #333;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  background: ${(props) =>
    props.variant === "primary" ? "#dc2626" : "#f3f4f6"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#333")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#b91c1c" : "#e5e7eb"};
  }
`;

export default function PermissionDeleteDialog({
  permissionId,
  onClose,
  onSuccess,
  adminToken,
}: PermissionDeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.DELETE_PERMISSION), {
        permission_id: permissionId,
        token: adminToken,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete permission:", error);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>删除权限</Title>
        <Message>确定要删除这个权限吗？此操作无法撤销。</Message>
        <ButtonGroup>
          <Button type="button" onClick={onClose}>
            取消
          </Button>
          <Button type="button" variant="primary" onClick={handleDelete}>
            确认删除
          </Button>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
}
