import React from "react";
import { 
  Car, 
  Wifi, 
  Droplets, 
  Zap, 
  ShieldCheck, 
  TreePine, 
  Utensils, 
  Dumbbell, 
  Armchair,
  Check
} from "lucide-react";

const FEATURE_ICONS = {
  "Free Parking": Car,
  "WiFi": Wifi,
  "Hot Water": Droplets,
  "24 hrs Electricity": Zap,
  "Security Guard": ShieldCheck,
  "Balcony": TreePine,
  "Kitchen": Utensils,
  "Gym": Dumbbell,
  "Furniture": Armchair,
};

export default function FeatureBadge({ name }) {
  const Icon = FEATURE_ICONS[name] || Check;

  return (
    <div className="sh-feature-badge">
      <div className="sh-feature-icon">
        <Icon size={18} strokeWidth={2} />
      </div>
      <span className="sh-feature-name">{name}</span>

      <style>{`
        .sh-feature-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #FAFAFA;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-md);
          transition: background var(--sh-transition-fast), border-color var(--sh-transition-fast);
        }

        .sh-feature-badge:hover {
          background: #F1F1F1;
          border-color: var(--sh-border);
        }

        .sh-feature-icon {
          color: var(--sh-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sh-feature-name {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--sh-text-primary);
        }
      `}</style>
    </div>
  );
}
