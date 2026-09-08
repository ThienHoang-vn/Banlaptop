"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/components/common/Icon";
import ProductModal from "@/components/admin/ProductModal";
import { deleteProduct, getProducts, updateProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { formatVND, getErrorMessage, getProductImage, STOCK_STATUS_LABELS } from "@/utils/formatters";

export default function AdminProductsPage() {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const fetchProducts = useCallback((params) => {
    setLoading(true);
    setError("");
    return getProducts(params)
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err, "Không thể tải danh sách sản phẩm.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (stockFilter) params.stockStatus = stockFilter;
      fetchProducts(params);
    }, 350);
    return () => clearTimeout(handler);
  }, [search, categoryFilter, stockFilter, page, fetchProducts]);

  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const categoryName = useMemo(
    () => categories.find((c) => c._id === categoryFilter)?.name || "",
    [categories, categoryFilter]
  );

  const inStockCount = useMemo(
    () => products.filter((p) => p.stockStatus === "in_stock").length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.stockStatus === "out_of_stock").length,
    [products]
  );

  const toggleSelectAll = (checked) => {
    const next = new Set();
    if (checked) {
      products.forEach((p) => next.add(p._id));
    }
    setSelected(next);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    try {
      await deleteProduct(product._id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(product._id);
        return next;
      });
      fetchProducts({ page, limit: 10, ...(search ? { search } : {}), ...(categoryFilter ? { category: categoryFilter } : {}) });
    } catch (err) {
      window.alert(getErrorMessage(err, "Không thể xóa sản phẩm."));
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await updateProduct(product._id, { isFeatured: !product.isFeatured });
      fetchProducts({ page, limit: 10, ...(search ? { search } : {}), ...(categoryFilter ? { category: categoryFilter } : {}) });
    } catch (err) {
      window.alert(getErrorMessage(err, "Không thể cập nhật trạng thái sản phẩm."));
    }
  };

  const handleExportCsv = () => {
    const rows = [
      ["name", "category", "price", "salePrice", "stockStatus", "cpu", "vga", "ram", "storage", "screen", "url"],
      ...products.map((p) => [
        p.name,
        p.category?.name || "",
        p.price,
        p.salePrice,
        p.stockStatus,
        p.specs?.cpu || "",
        p.specs?.vga || "",
        p.specs?.ram || "",
        p.specs?.storage || "",
        p.specs?.screen || "",
        `http://localhost:3000/products/${p.slug}`
      ])
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexlap-products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openCreate = () => {
    setModalProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalProduct(product);
    setModalOpen(true);
  };

  const onSaved = () => {
    fetchProducts({ page, limit: 10, ...(search ? { search } : {}), ...(categoryFilter ? { category: categoryFilter } : {}) });
  };

  return (
    <div className="p-6 lg:p-8 w-full">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-2.5 h-2.5 bg-primary" />
            <span className="font-display text-spec-code text-secondary tracking-widest uppercase">
              TELEMETRY // INVENTORY &amp; PIPELINE PULSE
            </span>
          </div>
          <h1 className="font-display text-headline-lg text-on-surface uppercase font-bold tracking-tight">
            QUẢN LÝ SẢN PHẨM
          </h1>
        </div>
        <span className="font-display text-spec-code text-on-surface-variant uppercase">
          Tổng đã lọc: {pagination.total} sản phẩm
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="font-display text-label-caps text-secondary uppercase tracking-wider">
              TỔNG SẢN PHẨM HOẠT ĐỘNG
            </span>
            <Icon name="inventory_2" className="text-primary text-xl" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-headline-xl text-on-surface font-bold">
              {pagination.total}
            </span>
            <span className="font-display text-spec-code text-secondary">SKUS ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 pt-2.5 font-body text-body-sm">
            <span className="inline-flex items-center gap-1 text-tertiary font-bold">
              <span className="w-2 h-2 bg-tertiary" />
              {inStockCount} Còn hàng
            </span>
            <span className="text-outline-variant">/</span>
            <span className="inline-flex items-center gap-1 text-error font-bold">
              <span className="w-2 h-2 bg-error" />
              {outOfStockCount} Hết hàng
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="font-display text-label-caps text-secondary uppercase tracking-wider">
              SẢN PHẨM HIỂN THỊ
            </span>
            <Icon name="visibility" className="text-tertiary text-xl" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-headline-xl text-on-surface font-bold">
              {inStockCount}
            </span>
            <span className="font-display text-spec-code text-tertiary font-bold">ĐANG MỞ BÁN</span>
          </div>
          <div className="h-2 w-full bg-surface-container overflow-hidden mt-3">
            <div
              className="h-full bg-tertiary transition-all duration-500"
              style={{ width: `${pagination.total ? (inStockCount / pagination.total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-on-surface text-surface p-5 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="font-display text-label-caps text-secondary-fixed uppercase tracking-wider">
              ĐÃ CHỌN TRONG BẢNG
            </span>
            <Icon name="checklist" className="text-primary-fixed text-xl" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-headline-xl text-primary-fixed font-bold">
              {selected.size}
            </span>
            <span className="font-display text-spec-code text-secondary-fixed">MỤC ĐÃ CHỌN</span>
          </div>
          <div className="flex items-center justify-between pt-2.5 border-t border-inverse-surface font-display text-spec-code text-secondary-fixed">
            <span>DANH SÁCH HIỆN TẠI: {products.length}</span>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-tertiary-fixed font-bold hover:underline uppercase"
            >
              Bỏ chọn hết
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Icon name="search" className="absolute left-3 top-2.5 text-secondary text-base" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên máy, CPU, GPU..."
              className="w-full bg-surface-container-low font-body text-body-md py-2 pl-9 pr-3 text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-display text-spec-code uppercase"
            >
              <Icon name="file_download" className="text-base" />
              Xuất CSV
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary hover:bg-primary font-display text-headline-sm uppercase transition-all shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Icon name="add_box" className="text-lg" />
              Thêm Sản Phẩm Mới
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-surface-container-low p-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-label-caps text-secondary uppercase mr-1">DANH MỤC:</span>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter("");
                setPage(1);
              }}
              className={`px-2.5 py-1 font-display text-spec-code ${
                !categoryFilter ? "text-on-primary bg-primary" : "text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container"
              }`}
            >
              TẤT CẢ
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat._id);
                  setPage(1);
                }}
                className={`px-2.5 py-1 font-display text-spec-code ${
                  categoryFilter === cat._id
                    ? "text-on-primary bg-primary"
                    : "text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container"
                }`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-label-caps text-secondary uppercase">TỒN KHO:</span>
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setPage(1);
              }}
              className="bg-surface-container-lowest font-display text-spec-code py-1 px-2 text-on-surface focus:outline-none"
            >
              <option value="">Tất Cả Tình Trạng</option>
              <option value="in_stock">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-6 p-10 text-center bg-surface-container-lowest shadow-sm font-display text-spec-code text-secondary uppercase">
          ĐANG ĐỒNG BỘ DỮ LIỆU KHO...
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 p-6 bg-error-container text-on-error-container font-body text-body-md font-semibold">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-surface-container-lowest shadow-sm overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-on-surface text-surface font-display text-spec-code uppercase select-none whitespace-nowrap">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selected.size === products.length}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary-fixed cursor-pointer"
                  />
                </th>
                <th className="p-3 w-16 text-center">Ảnh</th>
                <th className="p-3">Sản Phẩm</th>
                <th className="p-3">Phân Loại</th>
                <th className="p-3">Cấu Hình Nổi Bật</th>
                <th className="p-3 text-right">Giá Bán / Niêm Yết</th>
                <th className="p-3">Kho &amp; Tình Trạng</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body text-body-sm text-on-surface">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <Icon name="search_off" className="text-4xl text-outline mx-auto mb-3" />
                    <span className="font-display text-headline-sm text-on-surface uppercase font-bold block">
                      KHÔNG TÌM THẤY SẢN PHẨM
                    </span>
                    <span className="font-body text-body-sm text-on-surface-variant block mt-1">
                      Thử điều chỉnh từ khóa hoặc bộ lọc danh mục.
                    </span>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-surface-container-low/60 transition-colors group">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(product._id)}
                        onChange={() => toggleSelect(product._id)}
                        className="w-3.5 h-3.5 accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <div className="w-12 h-12 bg-surface-container flex items-center justify-center p-1">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="p-3 max-w-[240px]">
                      <span className="block font-display text-headline-sm text-on-surface group-hover:text-primary transition-colors break-words">
                        {product.name}
                      </span>
                      <span className="font-display text-spec-code text-secondary tracking-wider block mt-0.5 uppercase">
                        {product.slug}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="bg-surface-container px-2 py-0.5 font-display text-label-caps text-on-surface uppercase">
                        {product.category?.name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="p-3 min-w-[220px]">
                      <div className="flex flex-col gap-0.5 font-display text-[11px] text-on-surface-variant">
                        <span className="font-bold text-on-surface">CPU: {product.specs?.cpu || "-"}</span>
                        <span>RAM: {product.specs?.ram || "-"}</span>
                        <span className="text-primary font-bold">GPU: {product.specs?.vga || "-"}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <span className="block font-display text-headline-sm text-primary font-bold">
                        {formatVND(product.salePrice > 0 ? product.salePrice : product.price)}
                      </span>
                      <span className="block font-display text-spec-code text-outline line-through">
                        {product.salePrice > 0 ? formatVND(product.price) : "GIÁ GỐC"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className={`flex items-center gap-1.5 font-display text-spec-code font-bold whitespace-nowrap ${
                        product.stockStatus === "in_stock" ? "text-tertiary" : "text-error"
                      }`}>
                        <span className={`w-2 h-2 ${product.stockStatus === "in_stock" ? "bg-tertiary" : "bg-error"}`} />
                        {STOCK_STATUS_LABELS[product.stockStatus] || product.stockStatus}
                      </div>
                      <span
                        className={`inline-block mt-1 px-1.5 py-0.5 font-display text-[10px] uppercase ${
                          product.isFeatured
                            ? "bg-tertiary-fixed text-on-tertiary-fixed"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {product.isFeatured ? "ĐANG MỞ BÁN" : "ẨN KHỎI GD"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="p-1.5 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant transition-all"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Icon name="edit" className="text-sm" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFeatured(product)}
                          className="p-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-all"
                          title={product.isFeatured ? "Ẩn trên storefront" : "Hiện trên storefront"}
                        >
                          <Icon name={product.isFeatured ? "visibility_off" : "visibility"} className="text-sm" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="p-1.5 bg-surface-container hover:bg-error hover:text-on-error text-error transition-all"
                          title="Xóa sản phẩm"
                        >
                          <Icon name="delete" className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-4 bg-surface-container-low flex flex-wrap items-center justify-between gap-4 font-display text-spec-code text-on-surface-variant">
            <div className="flex items-center gap-3">
              <span>
                HIỂN THỊ {products.length} TRÊN {pagination.total} SẢN PHẨM
              </span>
              <span className="text-outline-variant">|</span>
              <span className="text-primary font-bold">ĐÃ CHỌN {selected.size} MỤC</span>
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40"
                >
                  PREV
                </button>
                {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                  const n = idx + 1;
                  if (pagination.totalPages > 7 && n !== 1 && n !== pagination.totalPages && Math.abs(n - pagination.page) > 1) {
                    if (n === 2 || n === pagination.totalPages - 1) {
                      return <span key={n} className="px-2 text-outline">...</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={`px-3 py-1 ${
                        pagination.page === n
                          ? "bg-primary text-on-primary font-bold"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <ProductModal
          product={modalProduct}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}