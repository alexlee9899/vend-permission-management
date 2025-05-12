"use client";

import { useState } from "react";
import styled from "styled-components";
import { getApiUrl, API_CONFIG } from "../../config/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_TOKEN } from "../../config/tokens";

interface LoginProps {
  onLoginSuccess?: () => void;
}

// 样式组件
const Container = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 30%;
  margin: 0 auto;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #0051b3;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

export default function Login({ onLoginSuccess }: LoginProps) {
  const router = useRouter();
  const { setToken, setUserEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleAdminLogin = () => {
    setIsAdmin(!isAdmin);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.status_code === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", formData.email);
        setToken(token);
        setUserEmail(formData.email);
        onLoginSuccess?.();

        // 根据用户类型跳转到不同页面
        if (isAdmin) {
          router.push("/admin");
          localStorage.setItem("adminToken", ADMIN_TOKEN);
        } else {
          router.push("/user");
        }
      } else {
        setError("Login failed: Invalid credentials");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Login failed, please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ToggleButton type="button" onClick={handleAdminLogin}>
        {isAdmin ? "Switch to User Login" : "Switch to Admin Login"}
      </ToggleButton>
      <Title>Welcome To PMS</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">{isAdmin ? "Admin Account" : "Email"}</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Please enter your email"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Please enter your password"
            required
          />
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : isAdmin ? "Admin Login" : "Login"}
        </SubmitButton>
      </Form>
    </Container>
  );
}
