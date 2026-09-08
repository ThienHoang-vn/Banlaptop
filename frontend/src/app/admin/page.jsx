"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/common/Icon";
import { getProducts } from "@/services/productService";
import { getLeads } from "@/services/leadService";
import { formatVND, formatDate, getProductImage, LEAD_STATUS_LABELS } from "@/utils/formatters";

const STATUS_BADGE = {
  pending: "bg-on-surface text-tertiary-fixed",
  contacted: "bg-secondary-fixed-dim text-on-secondary-fixed",
  done: "bg-tertiary text-on-tertiary"
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState({
    productTotal: 0,
    productInStock: 0,
    productOutOfStock: 0,
    leadTotal: 0,
    leadPending: 0,
    leadContacted: 0,
    leadDone: 0,
    recentLeads: [],
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getProducts({ page: 1, limit: 1 }),
      getProducts({ page: 1, limit: 1, stockStatus: "in_stock" }),
      getProducts({ page: 1, limit: 1, stockStatus: "out_of_stock" }),
      getProducts({ page: 1, limit: 5 }),
      getLeads({ page: 1, limit: 1 }),
      getLeads({ page: 1, limit: 1, status: "pending" }),
      getLeads({ page: 1, limit: 1, status: "contacted" }),
      getLeads({ page: 1, limit: 1, status: "done" }),
      getLeads({ page: 1, limit: 5 })
    ])
      .then(([allP, inP, outP, recentP, allL, pendL, contL, doneL, recentL]) => {
        setSummary({
          productTotal: allP.data.pagination?.total || 0,
          productInStock: inP.data.pagination?.total || 0,
          productOutOfStock: outP.data.pagination?.total || 0,
          leadTotal: allL.data.pagination?.total || 0,
          leadPending: pendL.data.pagination?.total || 0,
          leadContacted: contL.data.pagination?.total || 0,
          leadDone: doneL.data.pagination?.total || 0,
          recentLeads: recentL.data.leads || [],
          recentProducts: recentP.data.products || []
        });
      })
      .catch((err) => setError(err.response?.data?.message || "Không thể tải dữ liệu tổng quan."))
      .finally(() => setLoading(false));
  }, []);

  const conversionRate = summary.leadTotal
    ? Math.round((summary.leadDone / summary.leadTotal) * 1000) / 10
    : 0;

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
            TỔNG QUAN VẬN HÀNH
          </h1>
        </div>
        <span className="font-display text-spec-code text-on-surface-variant uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-tertiary animate-ping" />
          REALTIME SYNC
        </span>
      </div>

      {loading && (
        <div className="p-10 text-center bg-surface-container-lowest shadow-sm font-display text-spec-code text-secondary uppercase">
          ĐANG ĐỒNG BỘ DỮ LIỆU VẬN HÀNH...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 bg-error-container text-on-error-container font-body text-body-md font-semibold">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="font-display text-label-caps text-secondary uppercase tracking-wider">
                  TỔNG SẢN PHẨM
                </span>
                <Icon name="inventory_2" className="text-primary text-xl" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-headline-xl text-on-surface font-bold">{summary.productTotal}</span>
                <span className="font-display text-spec-code text-secondary">SKUS ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 pt-2 bg-surface-container-low px-2 py-1.5 font-body text-body-sm">
                <span className="inline-flex items-center gap-1 text-tertiary font-bold">
                  <span className="w-2 h-2 bg-tertiary" /> {summary.productInStock} Còn Hàng
                </span>
                <span className="text-outline-variant">/</span>
                <span className="inline-flex items-center gap-1 text-error font-bold">
                  <span className="w-2 h-2 bg-error" /> {summary.productOutOfStock} Hết Hàng
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="font-display text-label-caps text-secondary uppercase tracking-wider">
                  LEADS TƯ VẤN
                </span>
                <div className="flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed font-display text-spec-code px-1.5 py-0.5">
                  <span className="w-1.5 h-1.5 bg-tertiary animate-ping" />
                  LIVE
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-headline-xl text-on-surface font-bold">{summary.leadTotal}</span>
                <span className="font-display text-spec-code text-secondary">YÊU CẦU TƯ VẤN</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-2 font-display text-spec-code">
                <div className="bg-surface-container p-1 text-center">
                  <span className="block text-primary font-bold">{summary.leadPending}</span>
                  <span className="text-outline text-[10px]">PENDING</span>
                </div>
                <div className="bg-surface-container p-1 text-center">
                  <span className="block text-secondary font-bold">{summary.leadContacted}</span>
                  <span className="text-outline text-[10px]">CONTACTED</span>
                </div>
                <div className="bg-surface-container p-1 text-center">
                  <span className="block text-tertiary font-bold">{summary.leadDone}</span>
                  <span className="text-outline text-[10px]">DONE</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="font-display text-label-caps text-secondary uppercase tracking-wider">
                  TỶ LỆ XỬ LÝ PIPELINE
                </span>
                <Icon name="query_stats" className="text-tertiary text-xl" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-headline-xl text-on-surface font-bold">
                  {conversionRate}%
                </span>
                <span className="font-display text-spec-code text-tertiary font-bold flex items-center">
                  <Icon name="arrow_upward" className="text-xs font-bold" />
                  HOÀN THÀNH
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container overflow-hidden mt-3">
                <div className="h-full bg-tertiary transition-all duration-700" style={{ width: `${conversionRate}%` }} />
              </div>
              <span className="block font-display text-spec-code text-outline mt-1.5 text-right">
                {summary.leadTotal ? `${summary.leadDone}/${summary.leadTotal} lead` : "CHƯA CÓ DỮ LIỆU"}
              </span>
            </div>

            <div className="bg-on-surface text-surface p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="font-display text-label-caps text-secondary-fixed uppercase tracking-wider">
                  SẢN PHẨM CÒN HÀNG
                </span>
                <Icon name="rocket_launch" className="text-tertiary-fixed text-xl" />
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-headline-lg text-primary-fixed tracking-tight font-bold">
                  {summary.productInStock}
                </span>
                <span className="font-display text-spec-code text-surface-dim">SẢN PHẨM</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-inverse-surface font-display text-spec-code text-secondary-fixed">
                <span>SẴN SÀNG XUẤT KHO</span>
                <Link href="/admin/products" className="text-tertiary-fixed font-bold hover:underline uppercase">
                  Quản lý
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-7 bg-surface-container-lowest shadow-sm overflow-hidden">
              <div className="p-4 bg-on-surface text-surface flex items-center justify-between">
                <div className="flex items-center gap-2 font-display text-spec-code uppercase tracking-wider">
                  <Icon name="priority_high" className="text-tertiary-fixed text-lg" />
                  Leads mới nhất
                </div>
                <Link href="/admin/leads" className="text-tertiary-fixed font-bold hover:underline uppercase">
                  Xem tất cả
                </Link>
              </div>
              <div className="divide-y divide-surface-container-low">
                {summary.recentLeads.length === 0 ? (
                  <div className="p-8 text-center font-display text-spec-code text-secondary uppercase">
                    Chưa có lead nào
                  </div>
                ) : (
                  summary.recentLeads.map((lead) => (
                    <div key={lead._id} className="flex items-center gap-3 p-4 hover:bg-surface-container-low/60 transition-colors">
                      <div className="w-9 h-9 bg-primary-container/15 text-primary font-display text-headline-sm font-bold flex items-center justify-center flex-shrink-0">
                        {lead.customerName?.slice(0, 1)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display text-headline-sm text-on-surface font-bold truncate">
                            {lead.customerName}
                          </span>
                          <span className={`px-1.5 py-0.5 font-display text-spec-code uppercase ${STATUS_BADGE[lead.status]}`}>
                            {LEAD_STATUS_LABELS[lead.status]}
                          </span>
                        </div>
                        <div className="font-display text-spec-code text-secondary mt-0.5">
                          {lead.phone}
                          {lead.product ? ` • ${lead.product.name}` : " • Tư vấn chung"}
                        </div>
                      </div>
                      <span className="font-display text-spec-code text-on-surface-variant whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="xl:col-span-5 bg-surface-container-lowest shadow-sm overflow-hidden">
              <div className="p-4 bg-on-surface text-surface flex items-center justify-between">
                <div className="flex items-center gap-2 font-display text-spec-code uppercase tracking-wider">
                  <Icon name="new_releases" className="text-primary-fixed text-lg" />
                  Sản phẩm mới
                </div>
                <Link href="/admin/products" className="text-tertiary-fixed font-bold hover:underline uppercase">
                  Quản lý
                </Link>
              </div>
              <div className="divide-y divide-surface-container-low">
                {summary.recentProducts.length === 0 ? (
                  <div className="p-8 text-center font-display text-spec-code text-secondary uppercase">
                    Chưa có sản phẩm nào
                  </div>
                ) : (
                  summary.recentProducts.map((product) => (
                    <div key={product._id} className="flex items-center gap-3 p-4 hover:bg-surface-container-low/60 transition-colors">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-12 h-12 bg-surface-container object-contain p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block font-display text-headline-sm text-on-surface font-bold truncate">
                          {product.name}
                        </span>
                        <span className="font-display text-spec-code text-secondary block mt-0.5 uppercase">
                          {product.slug}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="block font-display text-headline-sm text-primary font-bold">
                          {formatVND(product.salePrice > 0 ? product.salePrice : product.price)}
                        </span>
                        <span className={`font-display text-spec-code ${product.stockStatus === "in_stock" ? "text-tertiary" : "text-error"}`}>
                          {product.stockStatus === "in_stock" ? "CÒN HÀNG" : "HẾT HÀNG"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}