import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { loadRocketParams, hasRocketParams } from "~/utils/storage/rocketStorage";
import type { RocketParams } from "../Rocket/types";

const Launch: React.FC = () => {
  const navigate = useNavigate();
  const [rocketParams, setRocketParams] = useState<RocketParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkRocketCache = async () => {
      try {
        // Check if rocket parameters exist in cache
        if (!hasRocketParams()) {
          setError("ロケットデータが見つかりません。デザインページからロケットを作成してください。");
          // Auto-redirect to previous page after 2 seconds
          setTimeout(() => {
            navigate("/design", { replace: true });
          }, 2000);
          return;
        }

        // Load rocket parameters from cache
        const params = await loadRocketParams();
        if (!params) {
          setError("ロケットデータの読み込みに失敗しました。デザインページからやり直してください。");
          setTimeout(() => {
            navigate("/design", { replace: true });
          }, 2000);
          return;
        }

        setRocketParams(params);
      } catch (err) {
        console.error("Error loading rocket parameters:", err);
        setError("ロケットデータの読み込み中にエラーが発生しました。");
        setTimeout(() => {
          navigate("/design", { replace: true });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    checkRocketCache();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>ロケットデータを読み込んでいます...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
        <h2>エラー</h2>
        <p>{error}</p>
        <p>2秒後に前のページに戻ります...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Launch Component</h1>
      <p>ロケット: {rocketParams?.name}</p>
      <p>This is the Launch feature of the application.</p>
    </div>
  );
};
export default Launch;
