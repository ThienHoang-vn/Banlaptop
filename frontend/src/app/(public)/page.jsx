"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/common/Icon";
import FilterSidebar from "@/components/client/FilterSidebar";
import ProductCard from "@/components/client/ProductCard";
import { useLeadModal } from "@/components/client/LeadModalProvider";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { getErrorMessage } from "@/utils/formatters";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" }
];

const EMPTY_FILTERS = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
  page: 1
};

function Hero({ onConsult }) {
  return (
    <section className="w-full bg-on-surface text-surface overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-primary/20 text-tertiary-fixed-dim font-display text-spec-code">
              <span className="w-2 h-2 bg-tertiary-fixed-dim animate-ping" />
              <span>CYBER HARDWARE EXPO // QUÝ 1.2026</span>
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-display-lg text-surface tracking-tight uppercase leading-none">
                LỄ HỘI LAPTOP GAMING <br />
                <span className="text-tertiary-fixed-dim">&amp; CREATOR 2026</span>
              </h1>
              <p className="font-body text-body-lg text-surface-variant max-w-xl">
                Hạ cánh dàn máy trạm di động &amp; cỗ máy chiến game cấu hình cực đỉnh. Giảm
                trực tiếp tới <strong className="text-tertiary-fixed-dim font-headline-sm">35%</strong>,
                tặng kèm Balo Gaming chính hãng và gói bảo dưỡng tản nhiệt trọn đời.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3 bg-inverse-surface/80 shadow-sm">
                <span className="block font-display text-label-caps text-secondary-fixed-dim">
                  MAX TDP DISCHARGE
                </span>
                <span className="font-display text-headline-sm text-surface">
                  175W + OVERCLOCK
                </span>
              </div>
              <div className="p-3 bg-inverse-surface/80 shadow-sm">
                <span className="block font-display text-label-caps text-secondary-fixed-dim">
                  KIẾN TRÚC MỚI
                </span>
                <span className="font-display text-headline-sm text-tertiary-fixed-dim">
                  RTX 50 SERIES
                </span>
              </div>
              <div className="p-3 bg-inverse-surface/80 shadow-sm">
                <span className="block font-display text-label-caps text-secondary-fixed-dim">
                  TẦN SỐ QUÉT
                </span>
                <span className="font-display text-headline-sm text-surface">
                  240Hz OLED
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("catalog-quadrant")?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3.5 bg-primary-container text-on-primary font-display text-headline-sm uppercase tracking-wider shadow-brutal-blue hover:-translate-y-0.5 transition-transform inline-flex items-center gap-2"
              >
                <Icon name="bolt" />
                KHÁM PHÁ DANH MỤC
              </button>
              <button
                type="button"
                onClick={() => onConsult(null)}
                className="px-5 py-3.5 bg-inverse-surface text-surface hover:bg-surface hover:text-on-surface font-display text-body-md uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <Icon name="redeem" className="text-tertiary-fixed-dim" />
                NHẬN VOUCHER 2.000.000₫
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative bg-surface-container-high/10 p-4 shadow-xl">
              <div className="absolute top-2 right-2 px-2.5 py-1 bg-tertiary text-on-tertiary font-display text-spec-code z-10">
                GIẢM TỚI 35%
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsm8TtOtRpEhsRoy3g_06QH8Hc8QG0wqD6PFyvqmDBLQYn3GlWs3e7fn_Bh-QUdrBYZuBrG4qHWV_g22Wzq6U5LbXzMcenW-dyJUw9H87nGgnRDXU3hxr0MEYppfYmQG5OCtceoC4OphpKirY5h-BKL-sb8-PVINYDNTp2f40IrUt1cHkUPojFsO_LEfVB0LMMPk1o0QhE8J1jWS9bhLFwcLa5RhNAscNNFeJXHReiYRpGcfDDq3jGyA"
                alt="Laptop gaming flagship"
                className="w-full h-80 object-cover"
              />
              <div className="mt-4 p-3 bg-inverse-surface flex items-center justify-between text-surface font-display text-spec-code">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                  <span>ASUS ROG ZEPHYRUS G16 OLED (2024)</span>
                </div>
                <span className="text-tertiary-fixed-dim font-bold">58.990.000₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <div className="w-full bg-surface-container-high text-on-surface shadow-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Icon name="verified_user" className="text-2xl" />
            </div>
            <div className="leading-tight">
              <h4 className="font-display text-body-md font-bold uppercase text-on-surface">
                100% CHÍNH HÃNG
              </h4>
              <p className="font-body text-body-sm text-secondary">Bảo hành 24T tận nơi</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-tertiary/10 text-tertiary flex items-center justify-center flex-shrink-0">
              <Icon name="published_with_changes" className="text-2xl" />
            </div>
            <div className="leading-tight">
              <h4 className="font-display text-body-md font-bold uppercase text-on-surface">
                ĐỔI TRẢ 30 NGÀY
              </h4>
              <p className="font-body text-body-sm text-secondary">Lỗi phần cứng 1 đổi 1</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Icon name="local_shipping" className="text-2xl" />
            </div>
            <div className="leading-tight">
              <h4 className="font-display text-body-md font-bold uppercase text-on-surface">
                GIAO SIÊU TỐC 2H
              </h4>
              <p className="font-body text-body-sm text-secondary">Nội thành HN &amp; TP.HCM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-tertiary/10 text-tertiary flex items-center justify-center flex-shrink-0">
              <Icon name="credit_card" className="text-2xl" />
            </div>
            <div className="leading-tight">
              <h4 className="font-display text-body-md font-bold uppercase text-on-surface">
                TRẢ GÓP 0% LÃI SUẤT
              </h4>
              <p className="font-body text-body-sm text-secondary">Thủ tục duyệt 5 phút</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Catalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catalogRef = useRef(null);
  const { openLeadModal } = useLeadModal();

  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serverCategoryName, setServerCategoryName] = useState("");

  const initialFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "newest",
      page: Number(searchParams.get("page")) || 1
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      setError("");
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort && filters.sort !== "newest") params.sort = filters.sort;
      params.page = filters.page;
      params.limit = 9;
      try {
        const res = await getProducts(params);
        setData(res.data);
        if (filters.category) {
          const cat = categories.find(
            (c) => c._id === filters.category || c.slug === filters.category
          );
          setServerCategoryName(cat ? cat.name : "");
        } else {
          setServerCategoryName("");
        }
      } catch (err) {
        setError(getErrorMessage(err, "Không thể tải danh sách sản phẩm."));
        setData(null);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [filters, categories]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
    if (filters.page > 1) params.set("page", String(filters.page));
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  }, [filters, router]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handleSortChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, sort: value, page: 1 }));
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...EMPTY_FILTERS });
    router.replace("/", { scroll: false });
  }, [router]);

  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 9, totalPages: 1 };
  const activeFilterCount = [
    filters.search,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort !== "newest" ? filters.sort : ""
  ].filter(Boolean).length;

  const removeFilter = (key) => handleFilterChange(key, "");

  return (
    <>
      <Hero onConsult={openLeadModal} />
      <TrustStrip />

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full" id="catalog-quadrant" ref={catalogRef}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3">
            <FilterSidebar
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>

          <main className="lg:col-span-9 space-y-6">
            <div className="bg-surface-container-lowest p-4 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-display text-headline-md uppercase text-on-surface">
                    DANH MỤC THIẾT BỊ
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container text-secondary font-display text-spec-code">
                    Hiển thị {pagination.total} sản phẩm
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-label-caps text-secondary uppercase hidden sm:inline">
                      SẮP XẾP:
                    </span>
                    <select
                      value={filters.sort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="bg-surface-container px-3 py-1.5 font-body text-body-sm text-on-surface focus:outline-none cursor-pointer"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-container pt-3">
                  <span className="font-display text-spec-code text-secondary uppercase flex items-center gap-1">
                    <Icon name="filter_alt" className="text-sm" />
                    Đang lọc:
                  </span>
                  {filters.search && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container text-on-surface font-display text-spec-code">
                      <span>Tìm: {filters.search}</span>
                      <button type="button" onClick={() => removeFilter("search")} className="hover:text-error">
                        <Icon name="close" className="text-sm" />
                      </button>
                    </div>
                  )}
                  {filters.category && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container text-on-surface font-display text-spec-code">
                      <span>{serverCategoryName || "Danh mục đã chọn"}</span>
                      <button type="button" onClick={() => removeFilter("category")} className="hover:text-error">
                        <Icon name="close" className="text-sm" />
                      </button>
                    </div>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container text-on-surface font-display text-spec-code">
                      <span>
                        {filters.minPrice ? `${Number(filters.minPrice).toLocaleString("vi-VN")}₫` : "Tối đa"}
                        {" - "}
                        {filters.maxPrice ? `${Number(filters.maxPrice).toLocaleString("vi-VN")}₫` : "Không giới hạn"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          handleFilterChange("minPrice", "");
                          handleFilterChange("maxPrice", "");
                        }}
                        className="hover:text-error"
                      >
                        <Icon name="close" className="text-sm" />
                      </button>
                    </div>
                  )}
                  {filters.sort !== "newest" && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container text-on-surface font-display text-spec-code">
                      <span>
                        Sắp xếp: {SORT_OPTIONS.find((s) => s.value === filters.sort)?.label}
                      </span>
                      <button type="button" onClick={() => removeFilter("sort")} className="hover:text-error">
                        <Icon name="close" className="text-sm" />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="font-display text-spec-code text-error hover:underline uppercase pl-2"
                  >
                    XÓA TẤT CẢ
                  </button>
                </div>
              )}
            </div>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-surface-container-lowest p-4 shadow-sm animate-pulse space-y-3"
                  >
                    <div className="h-5 w-2/3 bg-surface-container" />
                    <div className="h-44 bg-surface-container" />
                    <div className="h-5 w-3/4 bg-surface-container" />
                    <div className="h-12 bg-surface-container" />
                    <div className="h-10 bg-surface-container" />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="p-8 bg-error-container text-on-error-container font-body-md text-body-md font-semibold">
                {error}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="bg-surface-container-lowest p-12 shadow-sm text-center space-y-3">
                <Icon name="search_off" className="text-5xl text-outline mx-auto" />
                <h3 className="font-display text-headline-md uppercase text-on-surface font-bold">
                  KHÔNG TÌM THẤY SẢN PHẨM
                </h3>
                <p className="font-body text-body-md text-on-surface-variant">
                  Vui lòng điều chỉnh bộ lọc hoặc liên hệ hotline 1900 8899 để được tư vấn.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-primary text-on-primary font-display text-label-caps uppercase font-bold tracking-wider hover:bg-primary-container shadow-brutal-sm"
                >
                  XÓA TẤT CẢ BỘ LỌC
                </button>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {!loading && !error && pagination.totalPages > 1 && (
              <div className="bg-surface-container-lowest p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-display text-spec-code text-secondary">
                  TRANG {pagination.page} TRÊN {pagination.totalPages} // TỔNG CỘNG{" "}
                  {pagination.total} CẤU HÌNH SẴN SÀNG XUẤT KHO
                </span>
                <div className="flex items-center gap-1 font-display text-spec-code">
                  <button
                    type="button"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="px-3 py-1.5 bg-surface-container text-secondary hover:text-on-surface disabled:opacity-40"
                  >
                    TRƯỚC
                  </button>
                  {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                    const n = idx + 1;
                    if (
                      n === 1 ||
                      n === pagination.totalPages ||
                      Math.abs(n - pagination.page) <= 1
                    ) {
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => handlePageChange(n)}
                          className={`px-3 py-1.5 ${
                            n === pagination.page
                              ? "bg-primary text-on-primary font-bold"
                              : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                          }`}
                        >
                          {n}
                        </button>
                      );
                    }
                    if (idx === 1 || idx === pagination.totalPages - 2) {
                      return (
                        <span key={`ellipsis-${n}`} className="px-2 text-secondary">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="px-3 py-1.5 bg-surface-container text-secondary hover:text-on-surface disabled:opacity-40"
                  >
                    TIẾP
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <Catalog />
    </Suspense>
  );
}