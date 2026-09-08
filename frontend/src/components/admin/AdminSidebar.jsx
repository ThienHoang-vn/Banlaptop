"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/common/Icon";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: "dashboard" },
  { href: "/admin/products", label: "Quản lý sản phẩm", icon: "inventory_2" },
  { href: "/admin/leads", label: "Lead tư vấn", icon: "support_agent" }
];

function LogoMark() {
  return (
    <div className="w-8 h-8 bg-primary-container flex items-center justify-center shadow-sm">
      <Icon name="bolt" filled className="text-on-primary-container text-lg" />
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-40 bg-on-surface text-surface shadow-xl">
        <div className="p-5 border-b border-inverse-surface/30">
          <Link href="/admin" className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <span className="block font-display text-headline-sm font-bold uppercase tracking-tight text-primary-fixed">
                NEXLAP
              </span>
              <span className="block font-display text-spec-code text-secondary-fixed tracking-widest uppercase">
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 font-display text-spec-code uppercase">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold shadow-sm"
                    : "text-secondary-fixed hover:bg-inverse-surface hover:text-surface"
                }`}
              >
                <Icon name={item.icon} filled={isActive} className="text-xl" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-inverse-surface/30 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-primary-container text-on-primary-container flex items-center justify-center font-display text-headline-sm font-bold shadow-sm">
              {admin?.username?.slice(0, 2)?.toUpperCase()}
            </div>
            <div className="leading-tight min-w-0">
              <span className="block font-display text-body-sm font-bold text-surface truncate">
                {admin?.username || "admin"}
              </span>
              <span className="block font-display text-spec-code text-tertiary-fixed tracking-wider">
                ROOT ACCESS
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-error/15 text-secondary-fixed hover:bg-error hover:text-on-error font-display text-spec-code uppercase tracking-wider transition-all"
          >
            <Icon name="logout" className="text-base" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-on-surface text-surface shadow-lg">
        <div className="flex items-center justify-between p-3 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display text-headline-sm font-bold uppercase tracking-tight text-primary-fixed">
              NEXLAP CONSOLE
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-display text-spec-code text-tertiary-fixed tracking-wider uppercase">
              {admin?.username || "admin"}
            </span>
            <button
              type="button"
              onClick={logout}
              className="p-2 bg-error/15 text-secondary-fixed hover:bg-error hover:text-on-error transition-all"
              aria-label="Đăng xuất"
            >
              <Icon name="logout" className="text-lg" />
            </button>
          </div>
        </div>
        <nav className="flex bg-inverse-surface/10 font-display text-spec-code uppercase overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-4 py-3 whitespace-nowrap ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "text-secondary-fixed"
                }`}
              >
                <Icon name={item.icon} className="text-base" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="lg:hidden h-[110px]" />
    </>
  );
}