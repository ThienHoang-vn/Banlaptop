export const formatVND = (value) => {
  if (value === undefined || value === null) return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0
  }).format(value) + "₫";
};

export const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

export const getProductImage = (product) => {
  if (!product) return "/placeholder-laptop.svg";
  if (product.thumbnail && product.thumbnail.trim()) return product.thumbnail;
  if (product.images && product.images.length > 0) return product.images[0];
  return "/placeholder-laptop.svg";
};

export const getProductImages = (product) => {
  const list = [];
  if (!product) return list;
  if (product.thumbnail && product.thumbnail.trim()) list.push(product.thumbnail);
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img) list.push(img);
    });
  }
  return list.length > 0
    ? list
    : ["/placeholder-laptop.svg"];
};

export const getErrorMessage = (error, fallback = "Đã có lỗi xảy ra, vui lòng thử lại.") => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) return error.message;
  return fallback;
};

export const LEAD_STATUS_LABELS = {
  pending: "Chờ xử lý",
  contacted: "Đã liên hệ",
  done: "Hoàn thành"
};

export const STOCK_STATUS_LABELS = {
  in_stock: "Còn hàng",
  out_of_stock: "Hết hàng"
};