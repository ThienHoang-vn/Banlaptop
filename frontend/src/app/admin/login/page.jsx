"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/common/Icon";
import { getErrorMessage } from "@/utils/formatters";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err, "Tên đăng nhập hoặc mật khẩu không chính xác."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface-container-lowest p-8 shadow-lg">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-primary-container flex items-center justify-center shadow-sm">
              <Icon name="bolt" filled className="text-on-primary-container text-3xl" />
            </div>
            <div className="text-center">
              <h1 className="font-display text-headline-lg text-on-surface uppercase font-bold tracking-tight">
                NEXLAP ADMIN
              </h1>
              <span className="font-display text-spec-code text-secondary tracking-widest uppercase">
                Bảng điều khiển quản trị kho
              </span>
            </div>
            <span className="flex items-center gap-2 px-2.5 py-1 bg-on-surface text-tertiary-fixed font-display text-spec-code tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-tertiary-fixed animate-ping" />
              SECURE SESSION // JWT
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-display text-label-caps text-secondary uppercase mb-1.5">
                TÊN ĐĂNG NHẬP
              </label>
              <div className="relative">
                <Icon name="person" className="absolute left-3 top-2.5 text-secondary text-lg" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Nhập tên đăng nhập"
                  className="w-full bg-surface-container-low pl-10 pr-3 py-2 font-body text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-sm border-b-2 border-transparent focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-display text-label-caps text-secondary uppercase mb-1.5">
                MẬT KHẨU
              </label>
              <div className="relative">
                <Icon name="key" className="absolute left-3 top-2.5 text-secondary text-lg" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  className="w-full bg-surface-container-low pl-10 pr-3 py-2 font-body text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-sm border-b-2 border-transparent focus:border-primary transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-error-container text-on-error-container font-body-sm text-body-sm font-semibold flex items-center gap-2">
                <Icon name="error" className="text-lg" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary-container text-on-primary font-display text-headline-sm uppercase tracking-wider font-bold shadow-brutal-md hover:bg-primary transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:shadow-none"
            >
              {submitting ? "ĐANG XÁC THỰC..." : "ĐĂNG NHẬP"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-container font-display text-spec-code">
            <Link href="/" className="flex items-center gap-1.5 text-primary hover:underline uppercase">
              <Icon name="arrow_back" className="text-sm" />
              Về trang chủ
            </Link>
            <span className="text-outline uppercase">v1.0 • nexlap</span>
          </div>
        </div>
      </div>
    </div>
  );
}