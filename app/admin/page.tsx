"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import styled from "styled-components";
import BusinessCard from "@/components/business/BusinessCard";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const BusinessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const AdminPage = () => {
  const { token, adminToken, allBusinesses, fetchAllBusinesses } = useAuth();

  useEffect(() => {
    if (adminToken) {
      fetchAllBusinesses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, token]);

  return (
    <Container>
      <Title>Permission Management</Title>
      <BusinessGrid>
        {allBusinesses.map((business) => (
          <BusinessCard
            key={business._id}
            id={business._id}
            name={business.name}
            ownerId={business.owner_id}
            permissions={business.permissions}
          />
        ))}
      </BusinessGrid>
    </Container>
  );
};

export default AdminPage;
