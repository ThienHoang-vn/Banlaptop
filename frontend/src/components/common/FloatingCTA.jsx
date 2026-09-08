import Icon from "./Icon";

export default function FloatingCTA() {
  return (
    <>
      <div className="fixed bottom-6 right-24 z-40 hidden sm:flex items-center gap-3">
        <a
          className="flex items-center gap-2 px-3 py-2 bg-on-surface text-surface shadow-brutal-blue hover:-translate-y-0.5 transition-transform"
          href="tel:19008899"
        >
          <Icon name="call" className="text-tertiary-fixed-dim text-lg" />
          <div className="text-left font-spec-code text-spec-code leading-none">
            <span className="block text-[10px] text-secondary-fixed-dim">
              HOTLINE 24/7
            </span>
            <span className="font-bold text-surface">1900 8899</span>
          </div>
        </a>
        <a
          className="flex items-center gap-2 px-3 py-2 bg-primary-container text-on-primary shadow-brutal-sm hover:-translate-y-0.5 transition-transform"
          href="https://zalo.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping" />
          <span className="font-spec-code text-spec-code font-bold uppercase tracking-wider">
            CHAT ZALO KỸ THUẬT
          </span>
        </a>
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          className="w-12 h-12 bg-primary text-on-primary flex items-center justify-center shadow-brutal-sm hover:-translate-y-1 transition-transform"
          href="tel:19008899"
          aria-label="Gọi hotline"
        >
          <Icon name="phone_in_talk" className="text-xl" />
        </a>
        <a
          className="w-12 h-12 bg-tertiary text-on-tertiary flex items-center justify-center shadow-brutal-sm hover:-translate-y-1 transition-transform relative"
          href="#"
          aria-label="Hỗ trợ kỹ thuật"
        >
          <Icon name="support_agent" className="text-xl" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary-fixed rounded-full ring-2 ring-surface" />
        </a>
      </div>
    </>
  );
}