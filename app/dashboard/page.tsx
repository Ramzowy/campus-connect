import React from "react";
import MainLayout from "@/components/layout/main-layout";
import { AuthSessionProvider } from "@/components/session-provider";

export default function page() {
  return (
    <>
      <AuthSessionProvider>
        <MainLayout />
      </AuthSessionProvider>
    </>
  );
}
