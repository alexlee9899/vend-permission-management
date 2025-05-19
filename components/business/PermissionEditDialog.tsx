import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "@/config/api";

interface PermissionEditDialogProps {
  permission: {
    _id: string;
    name: string;
    level: string;
    expire: string;
  };
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
  max-width: 500px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #666;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  background: ${(props) =>
    props.variant === "primary" ? "#0070f3" : "#f3f4f6"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#333")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#0051b3" : "#e5e7eb"};
  }
`;

export default function PermissionEditDialog({
  permission,
  onClose,
  onSuccess,
  adminToken,
}: PermissionEditDialogProps) {
  const [formData, setFormData] = useState({
    name: permission.name,
    level: permission.level,
    expire: permission.expire,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PERMISSION), {
        permission_id: permission._id,
        updates: {
          ...formData,
        },
        token: adminToken,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update permission:", error);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>编辑权限</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>权限名称</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>权限级别</Label>
            <Input
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>过期时间</Label>
            <Input
              name="expire"
              value={formData.expire}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" variant="primary">
              保存
            </Button>
          </ButtonGroup>
        </Form>
      </Dialog>
    </Overlay>
  );
}
