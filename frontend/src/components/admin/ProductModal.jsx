"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/common/Icon";
import { createProduct, updateProduct } from "@/services/productService";
import { getErrorMessage } from "@/utils/formatters";

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  salePrice: "",
  thumbnail: "",
  imagesText: "",
  cpu: "",
  vga: "",
  ram: "",
  storage: "",
  screen: "",
  description: "",
  stockStatus: "in_stock",
  isFeatured: false
};

export default function ProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category?._id || product.category || "",
        price: product.price || "",
        salePrice: product.salePrice || "",
        thumbnail: product.thumbnail || "",
        imagesText: (product.images || []).join("\n"),
        cpu: product.specs?.cpu || "",
        vga: product.specs?.vga || "",
        ram: product.specs?.ram || "",
        storage: product.specs?.storage || "",
        screen: product.specs?.screen || "",
        description: product.description || "",
        stockStatus: product.stockStatus || "in_stock",
        isFeatured: Boolean(product.isFeatured)
      });
    } else {
      setForm({ ...EMPTY_FORM, category: categories[0]?._id || "" });
    }
  }, [product, categories]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const images = form.imagesText
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price) || 0,
      salePrice: Number(form.salePrice) || 0,
      thumbnail: form.thumbnail.trim(),
      images,
      specs: {
        cpu: form.cpu.trim(),
        vga: form.vga.trim(),
        ram: form.ram.trim(),
        storage: form.storage.trim(),
        screen: form.screen.trim()
      },
      description: form.description.trim(),
      stockStatus: form.stockStatus,
      isFeatured: form.isFeatured
    };

    try {
      if (product) {
        await updateProduct(product._id, payload);
      } else {
        await createProduct(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Không thể lưu sản phẩm."));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full bg-surface-container-low font-body text-body-md py-2 px-3 text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-sm";
  const labelCls = "block font-display text-label-caps text-secondary uppercase mb-1";

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-on-surface/60 p-4 lg:p-8">
      <div className="w-full max-w-2xl bg-surface-container-lowest shadow-xl my-auto">
        <div className="flex items-center justify-between p-5 border-b border-surface-container sticky top-0 bg-surface-container-lowest z-10">
          <div className="flex items-center gap-2">
            <Icon name="tune" className="text-primary text-xl" />
            <div>
              <span className="block font-display text-headline-sm uppercase text-on-surface tracking-tight font-bold">
                {product ? "CHỈNH SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
              </span>
              <span className="block font-display text-spec-code text-secondary">
                {product ? `SKU: ${product.slug?.toUpperCase()}` : "DRAWER CONSOLE // SKU_CREATOR"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 font-display text-spec-code font-bold">
              {product ? "EDIT MODE" : "DRAFT READY"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-surface-container text-on-surface hover:bg-error hover:text-on-error transition-all"
              aria-label="Đóng"
            >
              <Icon name="close" className="text-lg" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelCls}>TÊN SẢN PHẨM HOÀN CHỈNH *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              placeholder="Ví dụ: Lenovo Legion 7i Pro Gen 9 2024"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>PHÂN LOẠI DANH MỤC *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                required
                className="w-full bg-surface-container-low font-display text-spec-code py-2 px-2 text-on-surface focus:outline-none shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>GIÁ BÁN (₫) *</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                required
                placeholder="39990000"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>GIÁ NIÊM YẾT (₫)</label>
              <input
                type="number"
                min="0"
                value={form.salePrice}
                onChange={(e) => set("salePrice", e.target.value)}
                placeholder="0 nếu không giảm giá"
                className={inputCls}
              />
            </div>
          </div>

          <div className="bg-surface-container-low p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-spec-code text-primary uppercase font-bold flex items-center gap-1.5">
                <Icon name="memory" className="text-sm" />
                CẤU HÌNH PHẦN CỨNG
              </span>
              <span className="font-display text-spec-code text-secondary">NEXLAP SPEC LAB</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="block font-display text-[10px] uppercase text-secondary mb-0.5">CPU PROCESSOR</span>
                <input
                  value={form.cpu}
                  onChange={(e) => set("cpu", e.target.value)}
                  placeholder="Intel i9-14900HX"
                  className={inputCls}
                />
              </div>
              <div>
                <span className="block font-display text-[10px] uppercase text-secondary mb-0.5">GPU DISCRETE</span>
                <input
                  value={form.vga}
                  onChange={(e) => set("vga", e.target.value)}
                  placeholder="RTX 4080 12GB (175W)"
                  className={inputCls}
                />
              </div>
              <div>
                <span className="block font-display text-[10px] uppercase text-secondary mb-0.5">RAM CAPACITY</span>
                <input
                  value={form.ram}
                  onChange={(e) => set("ram", e.target.value)}
                  placeholder="32GB DDR5 5600MHz"
                  className={inputCls}
                />
              </div>
              <div>
                <span className="block font-display text-[10px] uppercase text-secondary mb-0.5">STORAGE SSD</span>
                <input
                  value={form.storage}
                  onChange={(e) => set("storage", e.target.value)}
                  placeholder="1TB NVMe Gen4 M.2"
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <span className="block font-display text-[10px] uppercase text-secondary mb-0.5">SCREEN</span>
                <input
                  value={form.screen}
                  onChange={(e) => set("screen", e.target.value)}
                  placeholder="18 inch 2.5K Nebula HDR (2560x1600) 240Hz"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>ẢNH ĐẠI DIỆN (URL)</label>
            <input
              value={form.thumbnail}
              onChange={(e) => set("thumbnail", e.target.value)}
              placeholder="https://.../anh-dai-dien.jpg"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>HÌNH ẢNH SẢN PHẨM (MỖI URL MỘT DÒNG)</label>
            <textarea
              value={form.imagesText}
              onChange={(e) => set("imagesText", e.target.value)}
              rows={3}
              placeholder={"https://.../front.jpg\nhttps://.../ports.jpg\nhttps://.../keyboard.jpg"}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>MÔ TẢ SẢN PHẨM</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Mô tả chi tiết sản phẩm..."
              className={inputCls}
            />
          </div>

          <div className="bg-surface-container-low p-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)}
                className="w-4 h-4 accent-tertiary"
              />
              <span className="font-display text-label-caps text-secondary uppercase">
                TRẠNG THÁI MỞ BÁN
              </span>
            </label>
            <div className="flex items-center gap-2">
              <span className="font-display text-label-caps text-secondary uppercase">
                TRẠNG THÁI KHO:
              </span>
              <select
                value={form.stockStatus}
                onChange={(e) => set("stockStatus", e.target.value)}
                className="bg-surface-container-lowest font-display text-spec-code py-1 px-2 text-on-surface focus:outline-none"
              >
                <option value="in_stock">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-error-container text-on-error-container font-body-sm text-body-sm font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setForm(product ? { ...form } : EMPTY_FORM);
                setError("");
              }}
              className="py-2.5 px-4 bg-surface-container text-on-surface hover:bg-surface-container-high font-display text-spec-code uppercase transition-all"
            >
              LÀM MỚI FORM
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-4 bg-primary text-on-primary hover:bg-primary-container font-display text-headline-sm uppercase transition-all shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:shadow-none"
            >
              {submitting ? "ĐANG LƯU..." : "LƯU SẢN PHẨM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}