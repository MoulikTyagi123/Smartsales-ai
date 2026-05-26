import { LayoutDashboard, Upload, MessageSquare, TrendingUp } from "lucide-react";

const navItems = [
  { id: "upload", label: "Upload Data", icon: Upload },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, requiresData: true },
  { id: "chat", label: "AI Chat", icon: MessageSquare, requiresData: true },
];

export default function Sidebar({ page, setPage, hasData }) {
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col"
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-muted)", border: "1px solid rgba(74,222,128,0.3)" }}
          >
            <TrendingUp size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <div className="text-sm font-bold leading-none" style={{ fontFamily: "Syne", color: "var(--text-primary)" }}>
              SmartSales
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono" }}>
              AI
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon, requiresData }) => {
          const disabled = requiresData && !hasData;
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => !disabled && setPage(id)}
              disabled={disabled}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? "var(--accent-muted)" : "transparent",
                color: active ? "var(--accent)" : disabled ? "var(--text-muted)" : "var(--text-secondary)",
                border: active ? "1px solid rgba(74,222,128,0.25)" : "1px solid transparent",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.4 : 1,
              }}
            >
              <Icon size={16} />
              {label}
              {disabled && (
                <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
                  Upload first
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Built with React · Node.js · Python
        </div>
      </div>
    </aside>
  );
}
