"use client";
import React, { useEffect, useState } from "react";
import { DetailedBusiness } from "@/context/AuthContext";
import styled from "styled-components";
import BusinessCard from "@/components/business/BusinessCard";
import { colors, radius, shadows } from "@/styles/theme";
import { SearchIcon } from "@/components/icons";

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 2rem 0;
  background: ${colors.background.gradient};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GlassGrid = styled.div`
  width: 100%;
  max-width: 1400px;
  background: ${colors.background.glass};
  box-shadow: ${shadows.glass};
  border-radius: ${radius.xl};
  padding: 2rem 1.5rem 3rem 1.5rem;
  margin: 0 auto;
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
`;

const Title = styled.h1`
  color: ${colors.primary.main};
  margin-bottom: 2.5rem;
  text-align: center;
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: 2px;
  background: ${colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  position: relative;
  width: 100%;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.secondary};
  pointer-events: none;
`;

const SearchInput = styled.input`
  padding: 1.1rem 1.5rem 1.1rem 3rem;
  border: 2px solid ${colors.border.light};
  border-radius: ${radius.lg};
  font-size: 1.15rem;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  background: ${colors.background.light};
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.06);
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: ${colors.primary.light};
    box-shadow: 0 0 0 4px ${colors.primary.light}40;
    transform: translateY(-2px) scale(1.03);
  }

  &::placeholder {
    color: ${colors.text.secondary};
    opacity: 0.7;
  }
`;

const BusinessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  padding: 1.5rem 0;
  animation: fadeIn 0.5s ease-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: ${colors.text.secondary};
  font-size: 1.2rem;
  margin: 4rem 0;
  padding: 2rem;
  background: ${colors.background.light};
  border-radius: ${radius.lg};
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.06);
  opacity: 0.85;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: ${colors.text.secondary};
  font-size: 1.3rem;
  margin: 4rem 0;
  padding: 2rem;
  background: ${colors.background.main};
  border-radius: ${radius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
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
        <GlassGrid>
          <Title>Permission Management</Title>
          <LoadingMessage>Loading...</LoadingMessage>
        </GlassGrid>
      </Container>
    );
  }

  return (
    <Container>
      <GlassGrid>
        <Title>Permission Management</Title>
        <SearchContainer>
          <SearchWrapper>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search by business name..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchWrapper>
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
      </GlassGrid>
    </Container>
  );
};

export default BusinessList;
