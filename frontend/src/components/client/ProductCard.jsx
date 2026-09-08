"use client";

import Link from "next/link";
import Icon from "../common/Icon";
import { useLeadModal } from "./LeadModalProvider";
import { formatVND, getProductImage } from "@/utils/formatters";

export default function ProductCard({ product }) {
  const { openLeadModal } = useLeadModal();

  if (!product) return null;

  const inStock = product.stockStatus === "in_stock";
  const hasSale = product.salePrice > 0 && product.salePrice < product.price;
  const discountPercent = hasSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const categoryName =
    product.category && typeof product.category === "object"
      ? product.category.name
      : product.categoryName || "";

  return (
    <div className="bg-surface-container-lowest p-4 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between group">
      <div className="space-y-3">
        <div className="flex items-center justify-between font-spec-code text-spec-code gap-2">
          <span
            className={`px-2 py-0.5 font-bold flex items-center gap-1 ${
              inStock ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
            }`}
          >
            <span className={`w-1.5 h-1.5 ${inStock ? "bg-tertiary" : "bg-error"}`} />
            {inStock ? "SẴN HÀNG" : "HẾT HÀNG"}
          </span>
          <span className="text-secondary uppercase truncate max-w-[40%]">
            {categoryName || "NEXLAP PRO"}
          </span>
        </div>

        <div className="relative bg-surface-container p-4 overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-error text-on-error font-spec-code text-spec-code font-bold">
              -{discountPercent}% TIẾT KIỆM
            </div>
          )}
        </div>

        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors line-clamp-1">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="font-body-sm text-body-sm text-secondary line-clamp-1">
            {product.specs?.screen || product.description || ""}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <div className="px-2 py-1 bg-surface-container font-spec-code text-spec-code text-on-surface truncate">
            <span className="text-secondary">CPU:</span> {product.specs?.cpu || "-"}
          </div>
          <div className="px-2 py-1 bg-surface-container font-spec-code text-spec-code text-on-surface truncate">
            <span className="text-secondary">GPU:</span> {product.specs?.vga || "-"}
          </div>
          <div className="px-2 py-1 bg-surface-container font-spec-code text-spec-code text-on-surface truncate">
            <span className="text-secondary">RAM:</span> {product.specs?.ram || "-"}
          </div>
          <div className="px-2 py-1 bg-surface-container font-spec-code text-spec-code text-on-surface truncate">
            <span className="text-secondary">SSD:</span> {product.specs?.storage || "-"}
          </div>
        </div>

        {product.description && (
          <div className="p-2 bg-surface-container-high/40 text-on-surface-variant font-body-sm text-body-sm flex items-center gap-2 line-clamp-1">
            <Icon name="receipt_long" className="text-sm text-tertiary" />
            <span>{product.description}</span>
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="font-display text-headline-md text-primary font-bold">
              {formatVND(hasSale ? product.salePrice : product.price)}
            </span>
            {hasSale && (
              <span className="block font-body-sm text-body-sm text-outline line-through">
                {formatVND(product.price)}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="py-2.5 px-3 bg-surface-container text-on-surface font-display text-label-caps uppercase hover:bg-surface-container-high transition-colors font-bold text-center"
          >
            XEM CHI TIẾT
          </Link>
          <button
            type="button"
            onClick={() => openLeadModal(product)}
            className="py-2.5 px-3 bg-primary text-on-primary font-display text-label-caps uppercase hover:bg-primary-container shadow-brutal-sm transition-transform font-bold text-center"
          >
            NHẬN TƯ VẤN
          </button>
        </div>
      </div>
    </div>
  );
}