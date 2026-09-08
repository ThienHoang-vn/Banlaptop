"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "./Icon";
import { useLeadModal } from "../client/LeadModalProvider";

const NAV_LINKS = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "LAPTOP GAMING", href: "/?search=gaming" },
  { label: "MACBOOK", href: "/?search=macbook" },
  { label: "WORKSTATION", href: "/?search=workstation" }
];

export default function Header() {
  const { openLeadModal } = useLeadModal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest border-b-2 border-on-surface shadow-[0_2px_0px_0px_#d7eaff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <span className="w-9 h-9 bg-on-surface flex items-center justify-center shadow-brutal-sm transition-transform group-hover:-translate-y-0.5">
              <Icon name="laptop_mac" className="text-tertiary-fixed-dim text-xl" />
            </span>
            <span className="leading-none">
              <span className="block font-display font-bold text-on-surface text-lg tracking-tight leading-none">
                NEX<span className="text-primary">LAP</span>
              </span>
              <span className="block font-display font-semibold text-[9px] text-secondary tracking-[0.18em] uppercase mt-0.5">
                Pro Store
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 font-display text-spec-code uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xs items-center bg-surface-container-low border border-outline-variant focus-within:border-primary focus-within:border-2 transition-colors"
          >
            <span className="pl-3 text-secondary">
              <Icon name="search" className="text-lg" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm cấu hình laptop..."
              className="w-full bg-transparent py-2 pr-3 pl-1 font-body text-body-md text-on-surface placeholder:text-outline focus:outline-none"
            />
          </form>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openLeadModal(null)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary font-display text-label-caps uppercase font-bold tracking-wider hover:bg-primary-container shadow-brutal-sm hover:-translate-y-0.5 transition-all"
            >
              <Icon name="support_agent" className="text-lg" />
              Nhận Ưu Đãi
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
              aria-label="Mở menu"
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t-2 border-on-surface bg-surface-container-lowest pb-4">
            <form onSubmit={handleSearch} className="flex items-center gap-0 mt-3">
              <span className="pl-3 text-secondary">
                <Icon name="search" className="text-lg" />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm cấu hình laptop..."
                className="w-full bg-transparent py-2 pr-3 pl-1 font-body text-body-md text-on-surface placeholder:text-outline focus:outline-none"
              />
            </form>
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 font-display text-spec-code uppercase text-on-surface hover:bg-surface-container hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openLeadModal(null);
                }}
                className="mt-2 px-4 py-3 bg-primary text-on-primary font-display text-label-caps uppercase font-bold tracking-wider text-center hover:bg-primary-container shadow-brutal-sm"
              >
                Nhận Ưu Đãi 2.000.000₫
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
