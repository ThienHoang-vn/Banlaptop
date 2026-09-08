"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Icon from "@/components/common/Icon";
import { useLeadModal } from "@/components/client/LeadModalProvider";
import { getProductBySlug } from "@/services/productService";
import { createLead } from "@/services/leadService";
import {
  formatVND,
  getErrorMessage,
  getProductImage,
  getProductImages
} from "@/utils/formatters";

function SpecTable({ product }) {
  const rows = [
    { label: "Vi xử lý (CPU)", value: product.specs?.cpu || "-" },
    { label: "Card đồ họa (GPU)", value: product.specs?.vga || "-" },
    { label: "Bộ nhớ trong (RAM)", value: product.specs?.ram || "-" },
    { label: "Ổ cứng lưu trữ (SSD)", value: product.specs?.storage || "-" },
    { label: "Màn hình hiển thị", value: product.specs?.screen || "-" }
  ];

  return (
    <div className="w-full overflow-hidden shadow-sm">
      <table className="w-full text-left font-body text-body-md">
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.label}
              className={idx % 2 === 0 ? "bg-surface-container-low" : "bg-surface-container-lowest"}
            >
              <td className="py-3.5 px-6 font-display text-spec-code text-secondary font-bold uppercase w-1/4">
                {row.label}
              </td>
              <td className="py-3.5 px-6 text-on-surface font-semibold">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineLeadForm({ product }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createLead({
        customerName: customerName.trim(),
        phone: phone.trim(),
        product: product._id,
        note: note.trim()
      });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể gửi yêu cầu tư vấn."));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-tertiary/10 p-4 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-tertiary font-display text-headline-sm uppercase font-bold">
          <Icon name="check_circle" filled />
          Đã nhận yêu cầu tư vấn!
        </div>
        <p className="font-body text-body-sm text-on-surface-variant">
          Chuyên viên NexLap sẽ liên hệ trong vòng 5 phút để xác nhận thông tin và gửi báo giá
          cùng các chương trình chiết khấu hiện hành.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-high p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-headline-sm uppercase text-on-surface font-bold flex items-center gap-1.5">
          <Icon name="local_fire_department" className="text-tertiary text-lg" />
          ĐỂ LẠI SĐT NHẬN GIẢM THÊM 500.000₫
        </span>
        <span className="font-display text-spec-code text-tertiary font-bold animate-pulse">
          PHẢN HỒI TRONG 5 PHÚT
        </span>
      </div>
      <p className="font-body text-body-sm text-on-surface-variant">
        Chuyên viên tư vấn sản phẩm sẽ liên hệ ngay để giải đáp thông số, chiết khấu và giữ quà
        tặng giới hạn.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block font-display text-label-caps text-secondary mb-1">
              HỌ VÀ TÊN
            </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full bg-surface-container-lowest px-3 py-2 text-on-surface font-body text-body-sm placeholder:text-outline-variant focus:outline-none shadow-sm border border-outline-variant focus:border-primary focus:border-2 transition-colors"
            />
          </div>
          <div>
            <label className="block font-display text-label-caps text-secondary mb-1">
              SỐ ĐIỆN THOẠI (ZALO)
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              placeholder="0909 xxx xxx"
              className="w-full bg-surface-container-lowest px-3 py-2 text-on-surface font-body text-body-sm placeholder:text-outline-variant focus:outline-none shadow-sm border border-outline-variant focus:border-primary focus:border-2 transition-colors"
            />
          </div>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú thêm (nâng cấp RAM/SSD, giờ gọi...)"
          rows={2}
          className="w-full bg-surface-container-lowest px-3 py-2 text-on-surface font-body text-body-sm placeholder:text-outline-variant focus:outline-none shadow-sm border border-outline-variant focus:border-primary focus:border-2 transition-colors"
        />
        {error && (
          <div className="p-2 bg-error-container text-on-error-container font-body-sm text-body-sm font-semibold">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-primary-container text-on-primary font-display text-headline-sm uppercase tracking-wider font-bold shadow-brutal-sm hover:bg-primary transition-all disabled:opacity-60 disabled:shadow-none"
        >
          {submitting ? "ĐANG GỬI..." : "NHẬN TƯ VẤN & MÃ GIẢM NGAY"}
        </button>
      </form>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { openLeadModal } = useLeadModal();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getProductBySlug(slug)
      .then((res) => {
        if (cancelled) return;
        setProduct(res.data);
        setActiveImage(getProductImages(res.data)[0]);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err, "Không tìm thấy sản phẩm."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[420px] bg-surface-container animate-pulse" />
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-surface-container animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-10 bg-surface-container animate-pulse" />
            <div className="h-20 bg-surface-container animate-pulse" />
            <div className="h-40 bg-surface-container animate-pulse" />
            <div className="h-32 bg-surface-container animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="bg-error-container text-on-error-container p-8 font-body-md text-body-md font-semibold">
          {error}
        </div>
        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2.5 bg-primary text-on-primary font-display text-label-caps uppercase font-bold tracking-wider shadow-brutal-sm"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  const inStock = product.stockStatus === "in_stock";
  const hasSale = product.salePrice > 0 && product.salePrice < product.price;
  const discountPercent = hasSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const images = getProductImages(product);
  const categoryName =
    product.category && typeof product.category === "object"
      ? product.category.name
      : "";
  const currentPrice = hasSale ? product.salePrice : product.price;

  return (
    <div className="pb-24 lg:pb-0">
      <div className="w-full bg-surface-container-low shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3">
          <nav className="flex items-center gap-2 font-display text-spec-code text-on-surface-variant flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="home" className="text-xs" />
              Trang chủ
            </Link>
            <span className="text-outline-variant">/</span>
            {categoryName ? (
              <>
                <Link href={`/?search=${encodeURIComponent(categoryName)}`} className="hover:text-primary transition-colors">
                  {categoryName}
                </Link>
                <span className="text-outline-variant">/</span>
              </>
            ) : null}
            <span className="text-primary font-bold tracking-tight line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="relative w-full aspect-[16/11] bg-surface-container-lowest overflow-hidden shadow-xl group flex flex-col justify-between p-6">
              <div className="flex items-center justify-between z-10 w-full">
                <div className="flex items-center gap-2">
                  {product.specs?.screen && (
                    <span className="px-2.5 py-1 bg-surface-container-high text-on-surface font-display text-spec-code flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-tertiary" />
                      <span className="line-clamp-1">{product.specs.screen}</span>
                    </span>
                  )}
                  <span className="px-2 py-1 bg-error text-on-error font-display text-spec-code tracking-wider uppercase shadow-sm hidden sm:inline">
                    BEST PRICE
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary shadow-sm transition-all" title="Phóng to quang học" onClick={() => openLeadModal(product)}>
                    <Icon name="zoom_in" className="text-base" />
                  </button>
                </div>
              </div>

              <div className="relative flex-1 flex items-center justify-center p-4">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-[380px] w-auto object-contain transition-transform duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-secondary font-display text-spec-code pt-2 flex-wrap gap-2">
                <span className="uppercase">
                  NEXLAP PRO // {product.slug?.toUpperCase() || "2026 ARCHITECTURE"}
                </span>
                <span className="flex items-center gap-1 text-tertiary">
                  <Icon name="verified_user" className="text-sm" />
                  CHÍNH HÃNG 100%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`cursor-pointer p-2 shadow-sm hover:shadow-md transition-all duration-150 relative ${
                    activeImage === img
                      ? "bg-surface-container-lowest shadow-md border-2 border-primary"
                      : "bg-surface-container border-2 border-transparent"
                  }`}
                >
                  <span className="absolute top-1 left-1 bg-primary text-on-primary font-display text-spec-code px-1 font-bold leading-tight z-10">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <img src={img} alt={`${product.name} - ảnh ${idx + 1}`} className="w-full aspect-[4/3] object-cover" />
                </button>
              ))}
            </div>

            <div className="bg-surface-container-high p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Icon name="scale" className="text-primary text-2xl" />
                <div>
                  <div className="font-display text-label-caps text-secondary uppercase">
                    Cấu hình mạnh
                  </div>
                  <div className="font-display text-headline-sm text-on-surface font-bold">
                    {product.specs?.cpu || "-"}
                  </div>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/40 hidden sm:block" />
              <div className="flex items-center gap-3">
                <Icon name="memory" className="text-primary text-2xl" />
                <div>
                  <div className="font-display text-label-caps text-secondary uppercase">
                    Bộ nhớ RAM
                  </div>
                  <div className="font-display text-headline-sm text-on-surface font-bold">
                    {product.specs?.ram || "-"}
                  </div>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/40 hidden sm:block" />
              <div className="flex items-center gap-3">
                <Icon name="hardware" className="text-tertiary text-2xl" />
                <div>
                  <div className="font-display text-label-caps text-secondary uppercase">
                    Ổ cứng SSD
                  </div>
                  <div className="font-display text-headline-sm text-on-surface font-bold">
                    {product.specs?.storage || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-surface-container-lowest p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-surface-container-highest text-primary font-display text-spec-code font-bold uppercase tracking-wider">
                  {categoryName || "NEXLAP PRO"}
                </span>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 font-display text-spec-code ${
                    inStock ? "bg-tertiary-container/30 text-tertiary" : "bg-error/10 text-error"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full animate-pulse ${inStock ? "bg-tertiary" : "bg-error"}`} />
                  <span>{inStock ? "SẴN HÀNG" : "HẾT HÀNG"}</span>
                </div>
              </div>

              <h1 className="font-display text-headline-lg text-on-surface leading-tight uppercase font-bold tracking-tight">
                {product.name}
              </h1>
              {product.description && (
                <p className="font-body text-body-sm text-on-surface-variant">
                  {product.description}
                </p>
              )}

              <div className="p-4 bg-surface-container-low shadow-sm flex flex-col gap-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-display text-headline-xl text-error font-bold tracking-tight">
                    {formatVND(currentPrice)}
                  </span>
                  {hasSale && (
                    <span className="line-through font-body text-body-md text-outline">
                      {formatVND(product.price)}
                    </span>
                  )}
                </div>
                {hasSale && (
                  <div className="flex items-center gap-2 font-display text-spec-code">
                    <span className="px-2 py-0.5 bg-error text-on-error font-bold">
                      -{discountPercent}% GIẢM
                    </span>
                    <span className="text-tertiary font-semibold">
                      Tiết kiệm ngay {formatVND(product.price - product.salePrice)} khi đặt mua hôm nay
                    </span>
                  </div>
                )}
                <div className="text-[12px] text-secondary font-body text-body-sm pt-1">
                  * Giá đã bao gồm thuế VAT 10% &amp; Hóa đơn điện tử VAT đầy đủ theo mã số thuế doanh nghiệp.
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-display text-label-caps text-secondary mb-1.5 uppercase">
                    <span>BỘ NHỚ RAM</span>
                    <span className="text-primary font-bold">{product.specs?.ram || "-"}</span>
                  </div>
                  <div className="p-3 bg-primary-container text-on-primary shadow-md flex flex-col">
                    <span className="font-display text-headline-sm font-bold">
                      {product.specs?.ram || "Theo cấu hình"}
                    </span>
                    <span className="font-display text-spec-code opacity-90">
                      Chuẩn bộ nhớ theo cấu hình xuất xưởng
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-display text-label-caps text-secondary mb-1.5 uppercase">
                    <span>Ổ CỨNG LƯU TRỮ</span>
                    <span className="text-primary font-bold">{product.specs?.storage || "-"}</span>
                  </div>
                  <div className="p-3 bg-on-surface text-surface shadow-md flex flex-col">
                    <span className="font-display text-headline-sm font-bold">
                      {product.specs?.storage || "Theo cấu hình"}
                    </span>
                    <span className="font-display text-spec-code opacity-80">
                      PCIe 4.0 NVMe • Hỗ trợ nâng cấp thêm khe M.2
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="tel:19008899"
                  className="w-full py-3.5 px-4 bg-tertiary hover:bg-tertiary-container text-on-tertiary flex items-center justify-between shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="call" className="text-2xl" />
                    <div className="text-left">
                      <div className="font-display text-headline-sm font-bold uppercase tracking-tight leading-none">
                        GỌI NGAY TƯ VẤN (1900 8899)
                      </div>
                      <div className="font-display text-spec-code opacity-90 leading-none pt-1">
                        Miễn phí 100% cước gọi • Kết nối kỹ sư ngay
                      </div>
                    </div>
                  </div>
                  <Icon name="arrow_forward" className="text-xl" />
                </a>
                <button
                  type="button"
                  onClick={() => openLeadModal(product)}
                  className="w-full py-3 px-4 bg-primary text-on-primary hover:bg-primary-container flex items-center justify-between shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="chat" className="text-2xl" />
                    <div className="text-left">
                      <div className="font-display text-headline-sm font-bold uppercase tracking-tight leading-none">
                        NHẬN BÁO GIÁ / TƯ VẤN NGAY
                      </div>
                      <div className="font-display text-spec-code opacity-90 leading-none pt-1">
                        Gửi thông số và báo giá trong 60 giây
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-surface-container-lowest text-primary font-display text-spec-code font-bold">
                    TƯ VẤN
                  </span>
                </button>

                <InlineLeadForm product={product} />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 bg-surface-container flex items-center gap-2.5 shadow-sm">
                  <Icon name="verified_user" className="text-tertiary text-2xl" />
                  <div className="leading-tight">
                    <span className="block font-display text-spec-code text-on-surface font-bold">
                      BẢO HÀNH 24 THÁNG
                    </span>
                    <span className="font-body text-body-sm text-secondary">Chính hãng toàn quốc</span>
                  </div>
                </div>
                <div className="p-3 bg-surface-container flex items-center gap-2.5 shadow-sm">
                  <Icon name="rocket_launch" className="text-primary text-2xl" />
                  <div className="leading-tight">
                    <span className="block font-display text-spec-code text-on-surface font-bold">
                      GIAO HÀNG HỎA TỐC 2H
                    </span>
                    <span className="font-body text-body-sm text-secondary">Nội thành HN &amp; TP.HCM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full">
        <div className="bg-surface-container-lowest shadow-xl">
          <div className="flex border-b border-outline-variant/30 overflow-x-auto bg-surface-container-low">
            <button
              type="button"
              className="px-8 py-4 font-display text-headline-sm uppercase tracking-wider bg-surface-container-lowest text-primary font-bold shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Icon name="developer_board" className="text-xl" />
              1. Thông số kỹ thuật chi tiết
            </button>
            <span className="px-8 py-4 font-display text-headline-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-2 whitespace-nowrap">
              <Icon name="description" className="text-xl" />
              2. Mô tả sản phẩm
            </span>
          </div>

          <div className="p-6 lg:p-10 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div>
                <h2 className="font-display text-headline-lg text-on-surface uppercase font-bold">
                  BẢNG THÔNG SỐ PHẦN CỨNG CHUẨN XÁC
                </h2>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Dữ liệu kỹ thuật từ phòng đo kiểm phần cứng NexLap Testing Lab.
                </p>
              </div>
            </div>
            <SpecTable product={product} />

            {product.description && (
              <div className="bg-surface-container-low p-5 shadow-sm">
                <h3 className="font-display text-headline-md text-on-surface uppercase font-bold mb-3">
                  MÔ TẢ SẢN PHẨM
                </h3>
                <p className="font-body text-body-md text-on-surface whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] flex lg:hidden items-center justify-between gap-3">
        <div>
          <div className="font-display text-spec-code text-secondary">GIÁ ƯU ĐÃI</div>
          <div className="font-display text-headline-sm text-error font-bold leading-tight">
            {formatVND(currentPrice)}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <a
            className="p-2.5 bg-tertiary text-on-tertiary flex items-center justify-center shadow-md"
            href="tel:19008899"
            aria-label="Gọi tư vấn"
          >
            <Icon name="call" className="text-lg" />
          </a>
          <button
            type="button"
            onClick={() => openLeadModal(product)}
            className="px-4 py-2.5 bg-primary text-on-primary font-display text-headline-sm font-bold uppercase tracking-wider shadow-md"
          >
            NHẬN BÁO GIÁ
          </button>
        </div>
      </div>
    </div>
  );
}