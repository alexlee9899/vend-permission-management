"use client";

import { AuthProvider } from "@/context/AuthContext";
import StyledComponentsRegistry from "@/lib/registry";
import MainLayout from "@/components/layout/MainLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Permission Management System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
