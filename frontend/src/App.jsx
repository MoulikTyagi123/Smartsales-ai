import { useState } from "react";
import Sidebar from "./components/Dashboard/Sidebar";
import MobileNav from "./components/Dashboard/MobileNav";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  const [page, setPage] = useState("upload");
  const [uploadId, setUploadId] = useState(null);

  const handleUploadSuccess = (id) => {
    setUploadId(id);
    setPage("dashboard");
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Desktop Sidebar */}
      <Sidebar
        className="desktop-sidebar"
        page={page}
        setPage={setPage}
        hasData={!!uploadId}
      />

      {/* Main Content */}
      <main
        className="main-content flex-1 overflow-auto"
        style={{ marginLeft: "var(--sidebar-width)", padding: "2rem" }}
      >
        {page === "upload" && (
          <UploadPage onSuccess={handleUploadSuccess} />
        )}
        {page === "dashboard" && (
          <DashboardPage uploadId={uploadId} />
        )}
        {page === "chat" && (
          <ChatPage uploadId={uploadId} />
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav page={page} setPage={setPage} hasData={!!uploadId} />
    </div>
  );
}