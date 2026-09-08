import Link from "next/link";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 bg-on-surface flex items-center justify-center">
              <Icon name="laptop_mac" className="text-tertiary-fixed-dim" />
            </span>
            <span className="font-headline-sm uppercase text-primary font-bold">
              NEXLAP PRO
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Nền tảng cung ứng máy trạm di động, laptop gaming đỉnh cao và thiết bị điện toán
            hiệu năng chuẩn quốc tế tại Việt Nam.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 font-spec-code text-spec-code text-secondary">
              <Icon name="verified" className="text-sm text-tertiary" />
              CHÍNH HÃNG 100% NHẬP KHẨU
            </div>
            <div className="flex items-center gap-2 font-spec-code text-spec-code text-secondary">
              <Icon name="sync_saved_locally" className="text-sm text-tertiary" />
              BẢO HÀNH 1 ĐỔI 1 TRONG 30 NGÀY
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-label-caps text-label-caps text-secondary uppercase font-bold">
            DANH MỤC SẢN PHẨM
          </h4>
          <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
            <li>
              <Link href="/?search=gaming" className="hover:text-primary transition-colors">
                Laptop Gaming & Esports
              </Link>
            </li>
            <li>
              <Link href="/?search=macbook" className="hover:text-primary transition-colors">
                MacBook & Apple Silicon
              </Link>
            </li>
            <li>
              <Link href="/?search=workstation" className="hover:text-primary transition-colors">
                Mobile Workstation
              </Link>
            </li>
            <li>
              <Link href="/?search=creator" className="hover:text-primary transition-colors">
                Creator & Đồ Họa 3D
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-label-caps text-label-caps text-secondary uppercase font-bold">
            CHÍNH SÁCH BÁN HÀNG
          </h4>
          <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
            <li className="cursor-pointer hover:text-primary transition-colors">
              Bảo hành 24 tháng tận nơi
            </li>
            <li className="cursor-pointer hover:text-primary transition-colors">
              Đổi trả 30 ngày (lỗi 1 đổi 1)
            </li>
            <li className="cursor-pointer hover:text-primary transition-colors">
              Giao hàng hỏa tốc 2 giờ
            </li>
            <li className="cursor-pointer hover:text-primary transition-colors">
              Trả góp 0% lãi suất
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-label-caps text-label-caps text-secondary uppercase font-bold">
            LIÊN HỆ & SHOWROOM
          </h4>
          <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
            <li className="flex items-center gap-2">
              <Icon name="call" className="text-sm text-tertiary" />
              Hotline 24/7: 1900 8899
            </li>
            <li className="flex items-center gap-2">
              <Icon name="location_on" className="text-sm text-tertiary" />
              Hà Nội: 102 Thái Hà, Đống Đa
            </li>
            <li className="flex items-center gap-2">
              <Icon name="location_on" className="text-sm text-tertiary" />
              TP.HCM: 360 Trần Hưng Đạo, Q.1
            </li>
            <li className="flex items-center gap-2">
              <Icon name="schedule" className="text-sm text-tertiary" />
              Mở cửa 8:00 - 21:00 mỗi ngày
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 font-spec-code text-spec-code text-secondary">
        <span>© 2026 NEXLAP PRO STORE. ALL RIGHTS RESERVED.</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-tertiary rounded-full" />
          SẴN SÀNG PHỤC VỤ • 24/7 TƯ VẤN KỸ THUẬT
        </span>
      </div>
    </footer>
  );
}