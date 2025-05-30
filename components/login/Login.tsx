"use client";

import { useState } from "react";
import styled from "styled-components";
import { getApiUrl, API_CONFIG } from "../../config/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_TOKEN } from "../../config/tokens";
import Image from "next/image";
import { colors } from "@/styles/theme";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/zh_en";

interface LoginProps {
  onLoginSuccess?: () => void;
}

// 整个页面容器
const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

// 登录表单容器
const Container = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 400px;
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
  background-color: black;
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
    background-color: #333333;
  }

  &:disabled {
    background-color: ${colors.button.disabled};
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${colors.button.secondary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #555555;
  }
`;

export default function Login({ onLoginSuccess }: LoginProps) {
  const router = useRouter();
  const { setToken, setUserEmail } = useAuth();
  const { lang } = useLanguage();
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
      setError(dict.login.enterValidAccount[lang]);
      return;
    }

    if (!formData.password) {
      setError(dict.login.enterPassword[lang]);
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
        setError(err.response?.data?.message || dict.login.loginFailed[lang]);
      } else {
        setError(dict.login.tryAgain[lang]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <ImageContainer>
        <Image
          src="/images/login.png"
          alt={dict.system.title[lang]}
          width={350}
          height={350}
          priority
        />
      </ImageContainer>
      <Container>
        <ToggleButton type="button" onClick={handleAdminLogin}>
          {isAdmin ? dict.login.switchUser[lang] : dict.login.switchAdmin[lang]}
        </ToggleButton>
        <Title>{dict.system.welcome[lang]} PMS</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">
              {isAdmin ? dict.login.adminAccount[lang] : dict.login.email[lang]}
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={dict.login.enterAccount[lang]}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">{dict.login.password[lang]}</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={dict.login.enterPassword[lang]}
              required
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading
              ? dict.nav.loggingIn[lang]
              : isAdmin
              ? dict.nav.adminLogin[lang]
              : dict.nav.login[lang]}
          </SubmitButton>
        </Form>
      </Container>
    </PageContainer>
  );
}
