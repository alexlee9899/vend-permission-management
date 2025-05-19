"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${(props) =>
    props.variant === "primary" ? "#0070f3" : "#f3f4f6"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#333")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#0051b3" : "#e5e7eb"};
  }
`;

export default function Header() {
  const router = useRouter();
  const { setToken, setUserEmail, setAdminToken } = useAuth();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // 清除本地存储中的所有令牌
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("adminToken");

      // 清除状态
      setToken(null);
      setUserEmail(null);
      setAdminToken(null);

      // 重定向到登录页面
      router.push("/");
    }
  };

  const handleReturn = () => {
    router.back();
  };

  return (
    <HeaderContainer>
      <Logo>
        <Image
          src="/images/brand.png"
          alt="Permission Management"
          width={150}
          height={50}
          priority
        />
      </Logo>
      <ButtonGroup>
        <Button onClick={handleReturn}>Return</Button>
        <Button variant="primary" onClick={handleLogout}>
          Logout
        </Button>
      </ButtonGroup>
    </HeaderContainer>
  );
}
