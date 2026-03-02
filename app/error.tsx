"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
            background: "radial-gradient(1200px 700px at 20% 10%, #1b2756 0%, #090b14 55%, #070910 100%)",
            color: "rgba(255,255,255,0.9)",
            gap: "16px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 22 }}>Something went wrong</h1>
          <p style={{ opacity: 0.75, lineHeight: 1.5, margin: 0, maxWidth: 360, textAlign: "center" }}>
            The page hit an unexpected error. Tap below to try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "12px 22px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Reload
          </button>
          <pre
            style={{
              marginTop: 8,
              opacity: 0.45,
              whiteSpace: "pre-wrap",
              fontSize: 12,
              maxWidth: 360,
            }}
          >
            {String(error?.message ?? "Unknown error")}
          </pre>
        </div>
      </body>
    </html>
  );
}

