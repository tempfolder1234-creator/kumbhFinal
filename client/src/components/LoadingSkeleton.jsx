import React from "react";

export function CardSkeleton() {
  return (
    <div className="sh-skeleton-card">
      <div className="sh-skeleton sh-skeleton-img" />
      <div className="sh-skeleton sh-skeleton-line" style={{ width: "70%", marginTop: "12px" }} />
      <div className="sh-skeleton sh-skeleton-line" style={{ width: "45%", marginTop: "6px" }} />
      <div className="sh-skeleton sh-skeleton-line" style={{ width: "35%", marginTop: "8px" }} />

      <style>{`
        .sh-skeleton-card {
          display: flex;
          flex-direction: column;
        }
        .sh-skeleton-img {
          width: 100%;
          padding-top: 80%;
          border-radius: var(--sh-radius-lg);
        }
        .sh-skeleton-line {
          height: 14px;
          border-radius: var(--sh-radius-sm);
        }
      `}</style>
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="sh-grid-listings">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="sh-container" style={{ padding: "40px 24px" }}>
      <div className="sh-skeleton" style={{ width: "40%", height: "32px", marginBottom: "16px" }} />
      <div className="sh-skeleton" style={{ width: "25%", height: "18px", marginBottom: "24px" }} />
      <div className="sh-skeleton" style={{ width: "100%", height: "420px", borderRadius: "16px", marginBottom: "32px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px" }}>
        <div>
          <div className="sh-skeleton" style={{ width: "80%", height: "20px", marginBottom: "12px" }} />
          <div className="sh-skeleton" style={{ width: "90%", height: "20px", marginBottom: "12px" }} />
          <div className="sh-skeleton" style={{ width: "60%", height: "20px", marginBottom: "24px" }} />
        </div>
        <div className="sh-skeleton" style={{ height: "300px", borderRadius: "16px" }} />
      </div>
    </div>
  );
}
