"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
`;

const UserInfo = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const InfoLabel = styled.div`
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  color: #333;
  font-size: 1.1rem;
`;

const BusinessList = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BusinessItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const BusinessName = styled.div`
  font-weight: 500;
  color: #333;
`;

const BusinessId = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
`;

export default function UserPage() {
  const router = useRouter();
  const { token, userEmail, businesses, isLoading, fetchBusinesses } =
    useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/");
      return;
    }

    if (token && businesses.length === 0) {
      fetchBusinesses();
    }
  }, [token, router, fetchBusinesses, isLoading, businesses.length]);

  if (isLoading) {
    return (
      <Container>
        <Title>加载中...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>用户信息</Title>
      <UserInfo>
        <InfoLabel>邮箱地址</InfoLabel>
        <InfoValue>{userEmail}</InfoValue>
      </UserInfo>

      <Title>业务列表</Title>
      <BusinessList>
        {businesses.map((business) => (
          <BusinessItem key={business._id}>
            <BusinessName>{business.name}</BusinessName>
            <BusinessId>ID: {business._id}</BusinessId>
          </BusinessItem>
        ))}
      </BusinessList>
    </Container>
  );
}
