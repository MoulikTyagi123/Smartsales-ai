import { LayoutDashboard, Upload, MessageSquare } from "lucide-react";

const navItems = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, requiresData: true },
  { id: "chat", label: "AI Chat", icon: MessageSquare, requiresData: true },
];

export default function MobileNav({ page, setPage, hasData }) {
  return (
    <nav className="mobile-nav">
      {navItems.map(({ id, label, icon: Icon, requiresData }) => {
        const disabled = requiresData && !hasData;
        const active = page === id;
        return (
          <button
            key={id}
            onClick={() => !disabled && setPage(id)}
            disabled={disabled}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all"
            style={{
              color: active ? "var(--accent)" : disabled ? "var(--text-muted)" : "var(--text-secondary)",
              opacity: disabled ? 0.35 : 1,
              background: "transparent",
              border: "none",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl transition-all"
              style={{
                background: active ? "var(--accent-muted)" : "transparent",
                border: active ? "1px solid rgba(74,222,128,0.25)" : "1px solid transparent",
              }}
            >
              <Icon size={16} />
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, fontFamily: "DM Sans" }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}