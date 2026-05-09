"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const isLandingPage = pathname === "/";
  const isPublicPage = isLandingPage || isAuthPage;

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#FFFFFF",
            color: "#1A1A1A",
            borderRadius: "16px",
            fontSize: "14px",
            fontWeight: "bold",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          },
          success: {
            iconTheme: {
              primary: "#55D688",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
      {isLandingPage && <Header />}
      {!isPublicPage && <Sidebar />}
      <main className={cn(
        "min-h-screen transition-all duration-500",
        isLandingPage ? "pt-20" : isAuthPage ? "" : "md:pl-72 pt-4 md:pt-8"
      )}>
        {!isPublicPage ? (
          <div className="max-w-7xl mx-auto py-4 px-0 md:p-8">
            {children}
          </div>
        ) : (
          children
        )}
      </main>
    </>
  );
}
