"use client";
import React, { useState } from "react";
import {
  Container,
  GlassGrid,
  Title,
} from "@/components/business/BusinessList";
import BusinessCard from "@/components/business/BusinessCard";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import styled from "styled-components";
import { colors, radius, shadows } from "@/styles/theme";
import { Permission } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/zh_en";

const SearchSection = styled.div`
  width: 100%;
  margin-bottom: 3rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid ${colors.border.light};
  border-radius: ${radius.lg};
  font-size: 1.1rem;
  background: ${colors.background.light};
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);

  &:focus {
    outline: none;
    border-color: ${colors.primary.light};
    box-shadow: 0 0 0 4px ${colors.primary.light}40;
  }
`;

const SearchButton = styled.button`
  padding: 1rem 2rem;
  background: ${colors.primary.gradient};
  color: white;
  border: none;
  border-radius: ${radius.lg};
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  &:disabled {
    background: ${colors.button.disabled};
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ type: "success" | "error" }>`
  padding: 1rem 1.5rem;
  margin: 1.5rem auto;
  max-width: 600px;
  border-radius: ${radius.lg};
  background-color: ${(props) =>
    props.type === "success" ? colors.success.light : colors.error.light};
  color: ${(props) =>
    props.type === "success" ? colors.success.main : colors.error.main};
  font-weight: 500;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ResultTitle = styled.h2`
  color: ${colors.primary.main};
  margin: 2rem 0 1.5rem 0;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
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

interface Business {
  _id: string;
  name: string;
  owner_id: string;
  permissions?: Permission[];
}

const Agent = () => {
  const router = useRouter();
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleBusinessClick = (businessId: string) => {
    router.push(`/admin/${businessId}`);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({
        text: dict.agent.enterEmail[lang],
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        "https://dev.vend88.com/shop/get_agent_business",
        {
          query: { email: email.trim() },
          secret: "VEND88SUPERADMIN2025",
        }
      );

      if (response.data.status_code === 200) {
        setBusinesses(response.data.businesses || []);
        setHasSearched(true);

        if (response.data.businesses?.length === 0) {
          setMessage({
            text: dict.agent.noResults[lang],
            type: "error",
          });
        }
      } else {
        setMessage({
          text: response.data.message || dict.agent.searchFailed[lang],
          type: "error",
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setMessage({
        text: axiosError.response?.data?.message || dict.agent.tryAgain[lang],
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <GlassGrid>
        <Title>{dict.agent.title[lang]}</Title>

        <SearchSection>
          {message && <Message type={message.type}>{message.text}</Message>}
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="email"
              placeholder={dict.agent.inputEmail[lang]}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SearchButton type="submit" disabled={isLoading}>
              {isLoading ? dict.nav.searching[lang] : dict.nav.search[lang]}
            </SearchButton>
          </SearchForm>
        </SearchSection>

        {hasSearched && (
          <>
            <ResultTitle>{dict.agent.searchResults[lang]}</ResultTitle>
            {businesses.length > 0 ? (
              <BusinessGrid>
                {businesses.map((business) => (
                  <BusinessCard
                    permissionDisabled={true}
                    key={business._id}
                    id={business._id}
                    name={business.name}
                    ownerId={business.owner_id}
                    permissions={business.permissions}
                    onClick={() => handleBusinessClick(business._id)}
                  />
                ))}
              </BusinessGrid>
            ) : (
              <NoResults>{dict.agent.noResults[lang]}</NoResults>
            )}
          </>
        )}
      </GlassGrid>
    </Container>
  );
};

export default Agent;
