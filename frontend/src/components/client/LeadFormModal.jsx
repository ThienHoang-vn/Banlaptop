"use client";

import { useState } from "react";
import Icon from "../common/Icon";
import { createLead } from "@/services/leadService";
import { formatVND, getErrorMessage, getProductImage } from "@/utils/formatters";

const USE_CASES = [
  "CHƠI GAME NẶNG",
  "ĐỒ HỌA 3D / RENDER",
  "LẬP TRÌNH / AI",
  "VĂN PHÒNG CAO CẤP"
];

export default function LeadFormModal({ product = null, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const purposeText = purpose ? `Mục đích: ${purpose}. ` : "";
    const fullNote = note.trim() ? `${purposeText}${note.trim()}` : purposeText.trim();

    try {
      await createLead({
        customerName: customerName.trim(),
        phone: phone.trim(),
        product: product && product._id ? product._id : null,
        note: fullNote
      });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể gửi yêu cầu tư vấn."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-on-surface/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-surface-container-lowest shadow-2xl my-auto overflow-hidden animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-inverse-surface text-inverse-on-surface p-6 sm:p-7 relative">
          <button
            type="button"
            aria-label="Đóng cửa sổ"
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-error hover:text-on-error transition-colors shadow-sm"
          >
            <Icon name="close" className="text-xl" />
          </button>
          <div className="flex items-center gap-2 font-spec-code text-spec-code text-tertiary-fixed-dim uppercase tracking-wider mb-2">
            <span className="w-2 h-2 bg-tertiary-fixed-dim rounded-full animate-pulse" />
            <span>HỆ THỐNG PHẢN HỒI KỸ THUẬT CẤP CAO // SECURE CHANNEL</span>
          </div>
          <h2 className="font-display text-headline-lg text-inverse-on-surface uppercase tracking-tight font-bold">
            YÊU CẦU BÁO GIÁ & TƯ VẤN CHUYÊN SÂU
          </h2>
          <p className="font-body-md text-body-md text-surface-container-highest mt-1">
            Chuyên viên kỹ thuật NexLap sẽ liên hệ hỗ trợ bạn trong vòng 5-10 phút với cấu
            hình & lộ trình bàn giao tối ưu.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          {success ? (
            <div className="space-y-4 py-8 text-center">
              <span className="inline-flex w-16 h-16 bg-tertiary/10 text-tertiary items-center justify-center shadow-brutal-sm">
                <Icon name="check_circle" className="text-4xl" filled />
              </span>
              <h3 className="font-display text-headline-lg uppercase text-on-surface font-bold">
                Cảm ơn Quý khách!
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                Yêu cầu tư vấn của bạn đã được ghi nhận. Chuyên viên NexLap sẽ gọi điện để
                xác nhận thông tin và gửi báo giá trong vòng 5 phút.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-primary text-on-primary font-display text-label-caps uppercase font-bold tracking-wider hover:bg-primary-container shadow-brutal-sm transition-all"
              >
                Đóng cửa sổ
              </button>
            </div>
          ) : (
            <>
              {product && (
                <div className="bg-surface-container-low p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-container-lowest overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary text-on-primary font-spec-code text-spec-code bg-surface-container-high">
                          MÁY TRẠM LỰA CHỌN
                        </span>
                      </div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                        {product.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 font-spec-code text-spec-code text-on-surface-variant pt-0.5">
                        {product.specs?.cpu && (
                          <span className="bg-surface-container-highest px-2 py-0.5 text-on-surface font-semibold">
                            {product.specs.cpu}
                          </span>
                        )}
                        {product.specs?.ram && (
                          <span className="bg-surface-container-highest px-2 py-0.5 text-on-surface font-semibold">
                            {product.specs.ram}
                          </span>
                        )}
                        {product.specs?.vga && (
                          <span className="bg-surface-container-highest px-2 py-0.5 text-on-surface font-semibold">
                            {product.specs.vga}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                    <span className="block font-label-caps text-label-caps text-secondary uppercase">
                      GIÁ ƯU ĐÃI TRỰC TUYẾN
                    </span>
                    <div className="font-display text-headline-lg text-primary font-bold">
                      {formatVND(product.salePrice > 0 ? product.salePrice : product.price)}
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-label-caps text-label-caps uppercase text-on-surface font-bold tracking-wider">
                      HỌ VÀ TÊN KHÁCH HÀNG <span className="text-error">*</span>
                    </label>
                    <div className="flex items-center bg-surface-container-lowest shadow-sm border border-outline-variant focus-within:border-primary focus-within:border-2 transition-colors">
                      <span className="material-symbols-outlined text-secondary px-3 text-lg">
                        person
                      </span>
                      <input
                        className="w-full py-2.5 pr-3 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none"
                        placeholder="Nguyễn Văn A"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-label-caps text-label-caps uppercase text-on-surface font-bold tracking-wider">
                      SỐ ĐIỆN THOẠI NHẬN TƯ VẤN / ZALO <span className="text-error">*</span>
                    </label>
                    <div className="flex items-center bg-surface-container-lowest shadow-sm border border-outline-variant focus-within:border-primary focus-within:border-2 transition-colors">
                      <span className="material-symbols-outlined text-secondary px-3 text-lg">
                        call
                      </span>
                      <input
                        className="w-full py-2.5 pr-3 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none"
                        placeholder="09xx xxx xxx (Ưu tiên số có Zalo)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        type="tel"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-label-caps text-label-caps uppercase text-on-surface font-bold tracking-wider">
                    MỤC ĐÍCH SỬ DỤNG CHÍNH ĐỂ KỸ SƯ CÂN ĐỐI CẤU HÌNH
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {USE_CASES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPurpose(purpose === item ? "" : item)}
                        className={`p-3 font-spec-code text-spec-code font-bold uppercase text-center transition-all ${
                          purpose === item
                            ? "bg-inverse-surface text-inverse-on-surface"
                            : "bg-surface-container text-on-surface font-medium hover:bg-surface-container-high"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-label-caps text-label-caps uppercase text-on-surface font-bold tracking-wider">
                    GHI CHÚ BỔ SUNG (YÊU CẦU RAM/SSD, HÓA ĐƠN, GIỜ GỌI)
                  </label>
                  <textarea
                    className="w-full p-3 bg-surface-container-lowest shadow-sm font-body-sm text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none border border-outline-variant focus:border-primary focus:border-2 transition-colors resize-none"
                    placeholder="Ví dụ: Cần nâng cấp lên 64GB RAM và kiểm tra nhiệt trước khi ship..."
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-error-container text-on-error-container font-body-sm text-body-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="flex items-center gap-2 p-2.5 bg-surface-container-high">
                    <Icon name="shield" className="text-primary text-xl" />
                    <div className="leading-none">
                      <span className="font-spec-code text-spec-code text-on-surface font-bold">
                        BẢO MẬT 100%
                      </span>
                      <span className="block font-body-sm text-body-sm text-secondary">
                        Mã hóa thông tin liên hệ
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-surface-container-high">
                    <Icon name="verified_user" className="text-tertiary text-xl" />
                    <div className="leading-none">
                      <span className="font-spec-code text-spec-code text-on-surface font-bold">
                        CAM KẾT KHÔNG SPAM
                      </span>
                      <span className="block font-body-sm text-body-sm text-secondary">
                        Chỉ gọi đúng lịch hẹn
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-surface-container-high">
                    <Icon name="redeem" className="text-tertiary-fixed-dim text-xl" />
                    <div className="leading-none">
                      <span className="font-spec-code text-spec-code text-on-surface font-bold">
                        TẶNG VOUCHER 500K
                      </span>
                      <span className="block font-body-sm text-body-sm text-secondary">
                        Áp dụng trực tiếp vào máy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-primary-container text-on-primary font-display text-headline-sm uppercase font-bold tracking-wider hover:bg-primary shadow-brutal-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none"
                  >
                    <Icon name="send" className="text-xl" />
                    {submitting ? "ĐANG GỬI..." : "GỬI YÊU CẦU TƯ VẤN NGAY"}
                  </button>
                  <div className="p-3 bg-surface-container text-center">
                    <p className="font-body-sm text-body-sm text-on-surface">
                      Hoặc gọi trực tiếp Hotline 24/7:{" "}
                      <a
                        className="font-headline-sm text-headline-sm text-primary font-bold hover:underline mx-1"
                        href="tel:19008899"
                      >
                        1900 8899
                      </a>
                      / Zalo Kỹ Thuật:{" "}
                      <a
                        className="font-headline-sm text-headline-sm text-tertiary font-bold hover:underline mx-1"
                        href="https://zalo.me"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        0988.123.456
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="bg-surface-container-low px-6 py-3 flex items-center justify-between font-spec-code text-spec-code text-secondary">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            NEXLAP LEAD ENGINES V4.8 - ALL NODES OPERATIONAL
          </span>
          <span className="hidden sm:inline">AES-256 BIT DIRECT PROTOCOL</span>
        </div>
      </div>
    </div>
  );
}