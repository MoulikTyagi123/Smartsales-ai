import { useState, useEffect, useRef } from "react";
import { checkUploadStatus, getAnalytics } from "../utils/api";

export function useAnalytics(uploadId) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!uploadId) return;

    setLoading(true);
    setError(null);
    setAnalytics(null);

    const poll = async () => {
      try {
        const statusRes = await checkUploadStatus(uploadId);
        if (statusRes.data.ready) {
          clearInterval(pollRef.current);
          const analyticsRes = await getAnalytics(uploadId);
          setAnalytics(analyticsRes.data);
          setLoading(false);
        }
        // No timeout — keep polling until ready
      } catch (err) {
        clearInterval(pollRef.current);
        setError(err.response?.data?.error || "Failed to load analytics");
        setLoading(false);
      }
    };

    poll();
    pollRef.current = setInterval(poll, 2000);

    return () => clearInterval(pollRef.current);
  }, [uploadId]);

  // If analytics already loaded in MongoDB, fetch directly
  useEffect(() => {
    if (!uploadId) return;
    getAnalytics(uploadId)
      .then((res) => {
        if (res.data && !res.data.processing) {
          setAnalytics(res.data);
          setLoading(false);
          clearInterval(pollRef.current);
        }
      })
      .catch(() => {});
  }, [uploadId]);

  return { analytics, loading, error };
}
