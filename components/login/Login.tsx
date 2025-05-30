"use client";

import { useState } from "react";
import styled from "styled-components";
import { getApiUrl, API_CONFIG } from "../../config/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_TOKEN } from "../../config/tokens";
import theme from "@/styles/theme";

interface LoginProps {
  onLoginSuccess?: () => void;
}

// 整个页面容器
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.primary.gradient};
  position: relative;
  overflow: hidden;
`;

// 登录表单容器
const GlassCard = styled.div`
  background: ${theme.colors.background.glass};
  box-shadow: ${theme.shadows?.glass || "0 8px 32px rgba(30, 64, 175, 0.10)"};
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: ${theme.radius?.xl || "32px"};
  border: 1.5px solid ${theme.colors.border.gradient};
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  max-width: 420px;
  width: 100%;
  margin: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2.5rem;
  color: ${theme.colors.primary.main};
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
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
  padding: 1rem 1.2rem;
  border: 1.5px solid ${theme.colors.border.main};
  border-radius: ${theme.radius.lg};
  font-size: 1.1rem;
  background: ${theme.colors.background.light};
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

const SubmitButton = styled.button`
  padding: 1rem 0;
  background: ${theme.colors.button.primary};
  color: ${theme.colors.text.inverse};
  border: none;
  border-radius: ${theme.radius.lg};
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin: 0 auto;
  box-shadow: ${theme.shadows.md};
  transition: all 0.2s;
  letter-spacing: 1px;

  &:hover:not(:disabled) {
    filter: brightness(1.1) saturate(1.2);
    transform: translateY(-2px) scale(1.03);
    box-shadow: ${theme.shadows.lg};
  }

  &:disabled {
    background: ${theme.colors.button.disabled};
    cursor: not-allowed;
    filter: grayscale(0.5);
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
      setError("Please enter a valid account");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      console.log(
        "Sending login request to:",
        getApiUrl(API_CONFIG.ENDPOINTS.LOGIN)
      );
      console.log("Request payload:", {
        email: formData.email,
        password: formData.password,
      });

      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response:", response.data);

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
          router.push("/agent");
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
    <PageContainer style={{ fontFamily: theme.font.family }}>
      <GlassCard
        style={{
          boxShadow: theme.shadows.glass,
          borderRadius: theme.radius.xl,
          border: `1.5px solid ${theme.colors.border.gradient}`,
        }}
      >
        <Title style={{ fontFamily: theme.font.family }}>权限管理系统</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">账号</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入邮箱"
              required
              style={{
                borderRadius: theme.radius.lg,
                fontFamily: theme.font.family,
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              required
              style={{
                borderRadius: theme.radius.lg,
                fontFamily: theme.font.family,
              }}
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton
            type="submit"
            disabled={isLoading}
            style={{ borderRadius: theme.radius.lg }}
          >
            {isLoading ? "登录中..." : "登录"}
          </SubmitButton>
        </Form>
      </GlassCard>
    </PageContainer>
  );
}
