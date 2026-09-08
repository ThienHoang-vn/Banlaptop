"use client";

import Icon from "../common/Icon";
import { useLeadModal } from "./LeadModalProvider";

const PRICE_PRESETS = [
  { label: "Dưới 25tr", min: "", max: "25000000" },
  { label: "25 - 40tr", min: "25000000", max: "40000000" },
  { label: "40 - 70tr", min: "40000000", max: "70000000" },
  { label: "Trên 70tr", min: "70000000", max: "" }
];

export default function FilterSidebar({
  filters,
  categories = [],
  onFilterChange,
  onReset
}) {
  const { openLeadModal } = useLeadModal();

  return (
    <aside className="space-y-6">
      <div className="bg-surface-container-low p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="tune" className="text-primary text-xl" />
          <span className="font-headline-sm text-headline-sm uppercase">BỘ LỌC CẤU HÌNH</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="font-spec-code text-spec-code text-primary hover:underline uppercase font-bold"
        >
          LÀM MỚI
        </button>
      </div>

      <div className="bg-surface-container-lowest p-4 shadow-sm space-y-3">
        <h3 className="font-label-caps text-label-caps text-secondary uppercase font-bold">
          TÌM KIẾM
        </h3>
        <div className="flex items-center bg-surface-container-low border border-outline-variant focus-within:border-primary focus-within:border-2 transition-colors">
          <span className="pl-3 text-secondary">
            <Icon name="search" className="text-lg" />
          </span>
          <input
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Tìm tên sản phẩm..."
            className="w-full bg-transparent py-2 pr-3 pl-1 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between pb-1">
          <h3 className="font-label-caps text-label-caps text-secondary uppercase font-bold">
            DANH MỤC
          </h3>
          <span className="font-spec-code text-spec-code text-outline">{categories.length} HÃNG</span>
        </div>
        <label className="flex items-center justify-between text-body-sm font-body-sm cursor-pointer p-1 hover:bg-surface-container">
          <span className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => onFilterChange("category", "")}
              className="w-4 h-4 rounded-none accent-primary"
            />
            <span className="font-semibold">Tất cả sản phẩm</span>
          </span>
        </label>
        {categories.map((cat) => (
          <label
            key={cat._id}
            className="flex items-center justify-between text-body-sm font-body-sm cursor-pointer p-1 hover:bg-surface-container"
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={
                  filters.category === cat._id || filters.category === cat.slug
                }
                onChange={() => onFilterChange("category", cat._id)}
                className="w-4 h-4 rounded-none accent-primary"
              />
              <span className="font-semibold">{cat.name}</span>
            </span>
            <span className="font-spec-code text-spec-code text-secondary">{cat.slug}</span>
          </label>
        ))}
      </div>

      <div className="bg-surface-container-lowest p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-label-caps text-label-caps text-secondary uppercase font-bold">
            KHOẢNG NGÂN SÁCH
          </h3>
          <span className="font-spec-code text-spec-code text-primary font-bold">VND</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              String(filters.minPrice || "") === preset.min &&
              String(filters.maxPrice || "") === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  onFilterChange("minPrice", preset.min);
                  onFilterChange("maxPrice", preset.max);
                }}
                className={`py-1.5 px-2 text-center font-spec-code text-spec-code transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-label-caps text-label-caps text-secondary uppercase mb-1 block">
              TỪ ( ₫ )
            </label>
            <input
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              placeholder="0"
              className="w-full bg-surface-container px-2.5 py-2 font-spec-code text-spec-code text-on-surface focus:outline-none placeholder:text-outline"
            />
          </div>
          <div>
            <label className="font-label-caps text-label-caps text-secondary uppercase mb-1 block">
              ĐẾN ( ₫ )
            </label>
            <input
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              placeholder="Tối đa"
              className="w-full bg-surface-container px-2.5 py-2 font-spec-code text-spec-code text-on-surface focus:outline-none placeholder:text-outline"
            />
          </div>
        </div>
      </div>

      <div className="bg-primary text-on-primary p-5 shadow-brutal-md space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="support_agent" className="text-tertiary-fixed-dim" />
          <span className="font-headline-sm text-body-md font-bold uppercase">
            CẦN TƯ VẤN CẤU HÌNH RIÊNG?
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-surface-container-highest">
          Đội ngũ Kỹ sư Phần cứng NexLap hỗ trợ phân tích TDP, render benchmark và tối ưu chi
          phí theo ngân sách dự án.
        </p>
        <button
          type="button"
          onClick={() => openLeadModal(null)}
          className="block w-full py-2.5 text-center bg-surface-container-lowest text-primary font-label-caps text-label-caps uppercase tracking-wider font-bold shadow-sm hover:bg-surface transition-colors"
        >
          YÊU CẦU GỌI LẠI TRONG 5 PHÚT
        </button>
      </div>
    </aside>
  );
}