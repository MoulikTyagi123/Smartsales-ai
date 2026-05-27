import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: `${BASE}/api` });

export const uploadCSV = (file, onProgress) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) =>
      onProgress && onProgress(Math.round((e.loaded / e.total) * 100)),
  });
};

export const checkUploadStatus = (uploadId) =>
  api.get(`/upload/status/${uploadId}`);

export const getAnalytics = (uploadId) => api.get(`/analytics/${uploadId}`);

export const getInsights = (uploadId) => api.get(`/insights/${uploadId}`);

export const sendChatMessage = (uploadId, query) =>
  api.post("/chat", { uploadId, query });

export const getRecentUploads = () => api.get("/analytics/recent");

export default api;
