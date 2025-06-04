"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/zh_en";
import { colors, radius, shadows } from "@/styles/theme";

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

const NavButtons = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-left: 2rem;
`;

const NavButton = styled.button`
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: ${radius.lg};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: ${colors.background.glass};
  color: ${colors.primary.main};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${shadows.sm};
  border: 1px solid ${colors.border.light};

  &:hover {
    background: ${colors.background.light};
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
    color: ${colors.primary.dark};
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${(props) =>
    props.variant === "primary" ? "#1a1a1b" : "#f3f4f6"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#333")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#0051b3" : "#e5e7eb"};
  }
`;

export default function Header() {
  const router = useRouter();
  const { setToken, setUserEmail, setAdminToken } = useAuth();
  const { lang, setLang } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // 清除本地存储中的所有令牌
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdmin");

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
          alt={dict.system.title[lang]}
          width={150}
          height={50}
          priority
        />
      </Logo>
      {isAdmin && (
        <NavButtons>
          <NavButton onClick={() => router.push("/admin")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 2.32 3.43h.12a21.5 21.5 0 0 0 4.5 0h.12a2.5 2.5 0 0 0 2.32-3.43 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5Z" />
              <path d="M19.5 9.5h-15a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z" />
              <path d="M12 10.5v3" />
              <path d="M7 10.5v3" />
              <path d="M17 10.5v3" />
            </svg>
            {dict.business.management[lang]}
          </NavButton>
          <NavButton onClick={() => router.push("/admin/agent")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {dict.detail.agentManagement[lang]}
          </NavButton>
        </NavButtons>
      )}
      <ButtonGroup>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "zh" | "en")}
          style={{
            borderRadius: 8,
            padding: "0.3rem 1rem",
            marginRight: 12,
            border: "1px solid #ddd",
            background: "#f3f4f6",
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
        <Button onClick={handleReturn}>{dict.nav.return[lang]}</Button>
        <Button variant="primary" onClick={handleLogout}>
          {dict.nav.logout[lang]}
        </Button>
      </ButtonGroup>
    </HeaderContainer>
  );
}
