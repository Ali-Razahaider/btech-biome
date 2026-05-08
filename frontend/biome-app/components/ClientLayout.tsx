"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/auth";

  return (
    <>
      {isPublicPage ? <Header /> : <Sidebar />}
      <main className={cn(
        "min-h-screen transition-all duration-500",
        isPublicPage ? "pt-20" : "md:pl-72 pt-4 md:pt-8"
      )}>
        {isPublicPage ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        )}
      </main>
    </>
  );
}
