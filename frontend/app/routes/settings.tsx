import { useNavigate, useParams, useLoaderData } from "react-router";
import { useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";

export default function SettingsModal() {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "0",
          minWidth: "400px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h2
            id="settings-title"
            style={{
              margin: 0,
              fontSize: "1.25rem",
              color: "#333",
            }}
          >
            Settings
          </h2>
          <button
            onClick={closeModal}
            aria-label="Close settings modal"
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
              padding: "0",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f0f0")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            ×
          </button>
        </div>
        <div style={{ padding: "20px", minHeight: "200px" }}>
          <p style={{ margin: "0 0 16px 0", color: "#666" }}>
            Settings panel content will be implemented here.
          </p>
          <div style={{ 
            padding: "12px", 
            backgroundColor: "#f0f8ff", 
            borderRadius: "4px",
            border: "1px solid #e1ecf4"
          }}>
            <small style={{ color: "#0969da" }}>
              Demo: This is a placeholder settings modal
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
