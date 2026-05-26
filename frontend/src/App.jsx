import { useState } from "react";
import Sidebar from "./components/Dashboard/Sidebar";
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
      <Sidebar
        page={page}
        setPage={setPage}
        hasData={!!uploadId}
      />
      <main className="flex-1 ml-64 p-8 overflow-auto">
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
    </div>
  );
}
