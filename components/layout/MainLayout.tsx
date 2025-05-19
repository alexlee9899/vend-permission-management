"use client";

import React, { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 确保组件已在客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname === "/";

  // 避免 hydration 错误
  if (!mounted) {
    return (
      <LayoutContainer>
        <Main>{children}</Main>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      {!isLoginPage && <Header />}
      <Main>{children}</Main>
    </LayoutContainer>
  );
}
