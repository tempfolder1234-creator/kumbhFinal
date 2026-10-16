import React from "react";
import { SearchX, RefreshCw } from "lucide-react";

export default function EmptyState({ title = "No accommodations found", message = "Try adjusting your search or category filter to discover more stays.", onReset }) {
  return (
    <div className="sh-empty-state">
      <div className="sh-empty-icon-wrap">
        <SearchX size={36} color="var(--sh-primary)" strokeWidth={1.75} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onReset && (
        <button className="sh-btn sh-btn-secondary" onClick={onReset}>
          <RefreshCw size={16} />
          <span>Clear all filters</span>
        </button>
      )}

      <style>{`
        .sh-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 24px;
          max-width: 480px;
          margin: 0 auto;
        }

        .sh-empty-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: var(--sh-radius-full);
          background: var(--sh-primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .sh-empty-state h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .sh-empty-state p {
          font-size: 0.95rem;
          margin-bottom: 24px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
