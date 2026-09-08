"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/common/Icon";
import { getLeads, updateLeadStatus, deleteLead } from "@/services/leadService";
import { getErrorMessage, formatDate, formatVND, getProductImage, LEAD_STATUS_LABELS } from "@/utils/formatters";

const STATUS_FILTERS = [
  { value: "", label: "TẤT CẢ" },
  { value: "pending", label: "CHỜ XỬ LÝ" },
  { value: "contacted", label: "ĐÃ LIÊN HỆ" },
  { value: "done", label: "HOÀN THÀNH" }
];

const STATUS_BADGE = {
  pending: "bg-on-surface text-tertiary-fixed",
  contacted: "bg-secondary-fixed-dim text-on-secondary-fixed",
  done: "bg-tertiary text-on-tertiary"
};

export default function AdminLeadsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [metrics, setMetrics] = useState({ total: 0, pending: 0, contacted: 0, done: 0 });

  const fetchLeads = useCallback((params) => {
    setLoading(true);
    setError("");
    return getLeads(params)
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err, "Không thể tải danh sách lead.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = { page, limit: 15 };
    if (statusFilter) params.status = statusFilter;
    fetchLeads(params);
  }, [statusFilter, page, fetchLeads]);

  useEffect(() => {
    const params = { page: 1, limit: 1 };
    Promise.all([
      getLeads(params),
      getLeads({ ...params, status: "pending" }),
      getLeads({ ...params, status: "contacted" }),
      getLeads({ ...params, status: "done" })
    ])
      .then(([all, pending, contacted, done]) => {
        setMetrics({
          total: all.data.pagination?.total || 0,
          pending: pending.data.pagination?.total || 0,
          contacted: contacted.data.pagination?.total || 0,
          done: done.data.pagination?.total || 0
        });
      })
      .catch(() => {});
  }, [statusFilter, page]);

  const leads = data?.leads || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 };

  const handleStatusChange = async (lead, status) => {
    if (status === lead.status) return;
    try {
      await updateLeadStatus(lead._id, status);
      fetchLeads({ page, limit: 15, ...(statusFilter ? { status: statusFilter } : {}) });
    } catch (err) {
      window.alert(getErrorMessage(err, "Không thể cập nhật trạng thái lead."));
    }
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Xóa lead của "${lead.customerName}" (${lead.phone})?`)) return;
    try {
      await deleteLead(lead._id);
      fetchLeads({ page, limit: 15, ...(statusFilter ? { status: statusFilter } : {}) });
    } catch (err) {
      window.alert(getErrorMessage(err, "Không thể xóa lead."));
    }
  };

  const metricCards = [
    { label: "TỔNG LEAD TƯ VẤN", value: metrics.total, icon: "leaderboard", tone: "text-primary" },
    { label: "CHỜ XỬ LÝ", value: metrics.pending, icon: "schedule", tone: "text-on-surface-variant" },
    { label: "ĐÃ LIÊN HỆ", value: metrics.contacted, icon: "call", tone: "text-secondary" },
    { label: "HOÀN THÀNH", value: metrics.done, icon: "task_alt", tone: "text-tertiary" }
  ];

  return (
    <div className="p-6 lg:p-8 w-full">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-2.5 h-2.5 bg-tertiary" />
            <span className="font-display text-spec-code text-secondary tracking-widest uppercase">
              PIPELINE // LEAD GENERATION CONSOLE
            </span>
          </div>
          <h1 className="font-display text-headline-lg text-on-surface uppercase font-bold tracking-tight">
            QUẢN LÝ LEAD TƯ VẤN
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-on-surface text-tertiary-fixed px-3 py-1.5 font-display text-spec-code tracking-widest uppercase shadow-sm">
          <span className="w-1.5 h-1.5 bg-tertiary-fixed animate-ping" />
          LIVE PIPELINE
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metricCards.map((card) => (
          <div key={card.label} className="bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="font-display text-label-caps text-secondary uppercase tracking-wider">
                {card.label}
              </span>
              <Icon name={card.icon} className={`text-xl ${card.tone}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-headline-xl text-on-surface font-bold">{card.value}</span>
              <span className="font-display text-spec-code text-secondary">LEADS</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest p-4 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`px-3.5 py-2 font-display text-label-caps uppercase tracking-wider ${
                statusFilter === f.value
                  ? "bg-primary text-on-primary font-bold shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f.label}
              {f.value && (
                <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] ${
                  statusFilter === f.value ? "bg-on-primary/20 text-on-primary" : "bg-surface-container-lowest text-on-surface-variant"
                }`}>
                  {metrics[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="p-10 text-center bg-surface-container-lowest shadow-sm font-display text-spec-code text-secondary uppercase">
          ĐANG ĐỒNG BỘ PIPELINE...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 bg-error-container text-on-error-container font-body text-body-md font-semibold">
          {error}
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className="bg-surface-container-lowest p-12 shadow-sm text-center space-y-3">
          <Icon name="inbox" className="text-5xl text-outline mx-auto" />
          <h3 className="font-display text-headline-md uppercase text-on-surface font-bold">
            CHƯA CÓ LEAD NÀO
          </h3>
          <p className="font-body text-body-md text-on-surface-variant">
            Lead yêu cầu tư vấn từ cửa hàng trực tuyến sẽ xuất hiện tại đây.
          </p>
        </div>
      )}

      {!loading && !error && leads.length > 0 && (
        <div className="bg-surface-container-lowest shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-on-surface text-surface font-display text-spec-code uppercase select-none whitespace-nowrap">
                <th className="p-3">Khách Hàng</th>
                <th className="p-3">Số Điện Thoại</th>
                <th className="p-3">Sản Phẩm Quan Tâm</th>
                <th className="p-3">Ghi Chú</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body text-body-sm text-on-surface">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-container/15 text-primary font-display text-headline-sm font-bold flex items-center justify-center">
                        {lead.customerName?.slice(0, 1)?.toUpperCase()}
                      </div>
                      <span className="font-display text-headline-sm text-on-surface font-bold">
                        {lead.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <a
                      href={`tel:${lead.phone}`}
                      className="font-display text-spec-code text-primary font-bold hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </td>
                  <td className="p-3 min-w-[220px]">
                    {lead.product ? (
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getProductImage(lead.product)}
                          alt={lead.product.name}
                          className="w-9 h-9 bg-surface-container object-contain p-0.5"
                        />
                        <div className="leading-tight min-w-0">
                          <span className="block font-body text-body-sm text-on-surface break-words">
                            {lead.product.name}
                          </span>
                          <span className="font-display text-spec-code text-secondary">
                            {formatVND(lead.product.price)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="font-display text-spec-code text-on-surface-variant uppercase">
                        TƯ VẤN CHUNG
                      </span>
                    )}
                  </td>
                  <td className="p-3 max-w-[200px]">
                    <span className="text-on-surface-variant break-words line-clamp-2 text-[12px]">
                      {lead.note || "-"}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-display text-spec-code text-secondary">{formatDate(lead.createdAt)}</span>
                  </td>
                  <td className="p-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead, e.target.value)}
                      className={`px-2 py-1.5 font-display text-spec-code font-bold uppercase cursor-pointer focus:outline-none ${STATUS_BADGE[lead.status]}`}
                    >
                      {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDelete(lead)}
                      className="p-1.5 bg-surface-container hover:bg-error hover:text-on-error text-error transition-all"
                      title="Xóa lead"
                    >
                      <Icon name="delete" className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 bg-surface-container-low flex flex-wrap items-center justify-between gap-4 font-display text-spec-code text-on-surface-variant">
            <span>HIỂN THỊ {leads.length} TRÊN {pagination.total} LEAD</span>
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
                <span className="px-3 py-1 bg-primary text-on-primary font-bold">
                  {pagination.page}/{pagination.totalPages}
                </span>
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
    </div>
  );
}