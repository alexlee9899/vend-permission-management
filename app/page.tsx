"use client";
import Login from "@/components/login";
import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
`;

export default function Home() {
  return (
    <Container>
      <Login />
    </Container>
  );
}
