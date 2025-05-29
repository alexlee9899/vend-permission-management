"use client";
import React, { useEffect, useState } from "react";
import { DetailedBusiness } from "@/context/AuthContext";
import styled from "styled-components";
import BusinessCard from "@/components/business/BusinessCard";
import { colors, radius } from "@/styles/theme";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${colors.text.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.md};
  font-size: 1rem;
  width: 100%;
  max-width: 500px;
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light}40;
  }
`;

const BusinessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const NoResults = styled.div`
  text-align: center;
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  margin: 3rem 0;
  width: 100%;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: ${colors.text.secondary};
  font-size: 1.2rem;
  margin: 4rem 0;
`;

interface BusinessListProps {
  title?: string;
  onBusinessClick?: (businessId: string) => void;
  token: string;
  adminToken: string;
  allBusinesses: DetailedBusiness[];
  fetchAllBusinesses: () => void;
}

const BusinessList: React.FC<BusinessListProps> = ({
  onBusinessClick,
  token,
  adminToken,
  allBusinesses,
  fetchAllBusinesses,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState<
    DetailedBusiness[]
  >([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (adminToken) {
      fetchAllBusinesses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBusinesses(allBusinesses);
    } else {
      const filtered = allBusinesses.filter((business) =>
        business.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    }
  }, [searchTerm, allBusinesses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!isClient) {
    return (
      <Container>
        <Title>Permission Management</Title>
        <LoadingMessage>Loading...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Permission Management</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by business name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </SearchContainer>
      {filteredBusinesses.length > 0 ? (
        <BusinessGrid>
          {filteredBusinesses.map((business) => (
            <BusinessCard
              key={business._id}
              id={business._id}
              name={business.name ?? ""}
              ownerId={business.owner_id ?? ""}
              permissions={business.permissions}
              onClick={() => onBusinessClick?.(business._id)}
            />
          ))}
        </BusinessGrid>
      ) : (
        <NoResults>No businesses match your search criteria</NoResults>
      )}
    </Container>
  );
};

export default BusinessList;
