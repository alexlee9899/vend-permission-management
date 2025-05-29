import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "@/config/api";
import { colors } from "@/styles/theme";

const permissionTypes = ["kiosk", "vend", "onlineshop", "kds"];

interface PermissionAddDialogProps {
  businessId: string;
  existingPermissions: string[];
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

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
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
    props.variant === "primary"
      ? colors.button.primary
      : colors.button.secondary};
  color: white;

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#333333" : "#555555"};
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export default function PermissionAddDialog({
  businessId,
  existingPermissions,
  onClose,
  onSuccess,
  adminToken,
}: PermissionAddDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    level: "1",
    expire: new Date().toISOString().split("T")[0],
  });
  const [availablePermissions, setAvailablePermissions] = useState<string[]>(
    []
  );
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("现有权限类型:", existingPermissions);
    // 过滤出可用的权限类型 (permissionTypes 中存在但 existingPermissions 中不存在的)
    const available = permissionTypes.filter(
      (type) => !existingPermissions.includes(type)
    );
    console.log("可用权限类型:", available);
    setAvailablePermissions(available);

    // 如果有可用权限，设置第一个为默认选项
    if (available.length > 0) {
      setFormData((prev) => ({ ...prev, name: available[0] }));
    }
  }, [existingPermissions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError("Please select a permission type");
      return;
    }

    try {
      console.log("add permission request:", {
        business_id: businessId,
        permission: {
          name: formData.name,
          expire: formData.expire,
          level: formData.level,
        },
        token: adminToken,
      });

      await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.ADD_PERMISSION), {
        business_id: businessId,
        permission: {
          name: formData.name,
          expire: formData.expire,
          level: formData.level,
        },
        token: adminToken,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add permission:", error);
      setError("Failed to add permission, please try again");
    }
  };

  const renderOptions = () => {
    if (availablePermissions.length === 0) {
      return <option value="">No available permission types</option>;
    }

    return availablePermissions.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ));
  };

  if (availablePermissions.length === 0) {
    return (
      <Overlay onClick={onClose}>
        <Dialog onClick={(e) => e.stopPropagation()}>
          <Title>Add Permission</Title>
          <p>This business already has all available permission types.</p>
          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              关闭
            </Button>
          </ButtonGroup>
        </Dialog>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>Add Permission</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Permission Type</Label>
            <Select
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              {renderOptions()}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Permission Level (1-3)</Label>
            <Select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Expiration Time</Label>
            <Input
              type="date"
              name="expire"
              value={formData.expire}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add
            </Button>
          </ButtonGroup>
        </Form>
      </Dialog>
    </Overlay>
  );
}
