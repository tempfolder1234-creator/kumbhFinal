import React from "react";
import { 
  Flame, 
  Coffee, 
  Ticket, 
  Waves, 
  Palmtree, 
  Sparkles, 
  TreePine, 
  Snowflake,
  LayoutGrid,
  Tent,
  Hotel
} from "lucide-react";

const CATEGORIES = [
  { id: "All", label: "All Stays", icon: LayoutGrid },
  { id: "Camps", label: "Camps", icon: Tent },
  { id: "Stay", label: "Stays", icon: Hotel },
  { id: "Trending", label: "Trending", icon: Flame },
  { id: "Bed&Breakfast", label: "Bed & Breakfast", icon: Coffee },
  { id: "icons", label: "Icons", icon: Ticket },
  { id: "Lake", label: "Lake", icon: Waves },
  { id: "Beach", label: "Beach", icon: Palmtree },
  { id: "OMG", label: "OMG!", icon: Sparkles },
  { id: "Farm", label: "Farm", icon: TreePine },
  { id: "Arctic", label: "Arctic", icon: Snowflake },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory, showTax, setShowTax }) {
  return (
    <div className="sh-category-filter-wrap">
      <div className="sh-container sh-filter-container">
        <div className="sh-categories-bar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`sh-category-item ${isActive ? "active" : ""}`}
                onClick={() => onSelectCategory(cat.id)}
                aria-pressed={isActive}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* GST / Taxes Toggle */}
        <div className="sh-tax-toggle">
          <span className="sh-tax-label">Display total before taxes</span>
          <button 
            type="button" 
            role="switch" 
            aria-checked={showTax}
            className={`sh-switch ${showTax ? "checked" : ""}`}
            onClick={() => setShowTax(!showTax)}
          >
            <span className="sh-switch-thumb" />
          </button>
        </div>
      </div>

      <style>{`
        .sh-category-filter-wrap {
          background: #FFFFFF;
          border-bottom: 1px solid var(--sh-border-light);
          position: sticky;
          top: var(--sh-header-height);
          z-index: 90;
        }

        .sh-filter-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .sh-tax-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--sh-border);
          border-radius: var(--sh-radius-md);
          padding: 10px 16px;
          flex-shrink: 0;
          cursor: pointer;
          user-select: none;
        }

        .sh-tax-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--sh-text-primary);
          white-space: nowrap;
        }

        .sh-switch {
          width: 44px;
          height: 24px;
          background: #B0B0B0;
          border-radius: var(--sh-radius-full);
          position: relative;
          transition: background var(--sh-transition);
        }

        .sh-switch.checked {
          background: #222222;
        }

        .sh-switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: #FFFFFF;
          border-radius: 50%;
          transition: transform var(--sh-transition);
        }

        .sh-switch.checked .sh-switch-thumb {
          transform: translateX(20px);
        }

        @media (max-width: 992px) {
          .sh-tax-toggle {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
