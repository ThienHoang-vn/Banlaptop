"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Icon from "@/components/common/Icon";

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
    if (isAuthenticated && isLoginPage) {
      router.replace("/admin");
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <Icon name="eco" className="text-primary text-5xl animate-spin-slow" />
        <span className="font-display text-spec-code text-secondary tracking-widest uppercase">
          NexLap Console // đang xác thực phiên làm việc
        </span>
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  if (isLoginPage) {
    return children;
  }

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}