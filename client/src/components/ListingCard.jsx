import React, { useState } from "react";
import { Star, MapPin } from "lucide-react";

export default function ListingCard({ listing, onClick, showTax }) {
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80";

  const imageUrl = (!imgError && listing.image && listing.image.url) 
    ? listing.image.url 
    : fallbackImage;

  // Calculate rating if reviews array exists
  let avgRating = null;
  let reviewCount = 0;
  if (Array.isArray(listing.reviews) && listing.reviews.length > 0) {
    reviewCount = listing.reviews.length;
    const total = listing.reviews.reduce((sum, rev) => {
      const r = Number(rev.rating) || 5;
      return sum + r;
    }, 0);
    avgRating = (total / reviewCount).toFixed(1);
  }

  const basePrice = Number(listing.price) || 0;
  const totalPrice = showTax ? Math.round(basePrice * 1.18) : basePrice;

  return (
    <div 
      className="sh-listing-card"
      onClick={() => onClick(listing._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(listing._id);
        }
      }}
    >
      <div className="sh-card-image-wrap">
        <img
          src={imageUrl}
          alt={listing.title || "Accommodation stay"}
          className="sh-card-image"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {listing.category && (
          <span className="sh-card-badge">{listing.category}</span>
        )}
      </div>

      <div className="sh-card-content">
        <div className="sh-card-header">
          <h3 className="sh-card-title">{listing.title}</h3>
          {avgRating ? (
            <div className="sh-card-rating">
              <Star size={14} fill="#222222" color="#222222" />
              <span>{avgRating}</span>
              <span className="sh-rating-count">({reviewCount})</span>
            </div>
          ) : (
            <span className="sh-card-new">New</span>
          )}
        </div>

        <div className="sh-card-location">
          <MapPin size={13} />
          <span>{listing.location}, {listing.country}</span>
        </div>

        <div className="sh-card-price">
          <strong>&#8377; {totalPrice.toLocaleString("en-IN")}</strong>
          <span> night</span>
          {showTax && (
            <span className="sh-tax-note"> (incl. 18% GST)</span>
          )}
        </div>
      </div>

      <style>{`
        .sh-card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--sh-text-primary);
          padding: 4px 10px;
          border-radius: var(--sh-radius-full);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .sh-card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--sh-text-primary);
          flex-shrink: 0;
        }

        .sh-rating-count {
          color: var(--sh-text-secondary);
          font-size: 0.78rem;
          font-weight: 400;
        }

        .sh-card-new {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--sh-text-secondary);
        }

        .sh-card-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.875rem;
          color: var(--sh-text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sh-tax-note {
          font-size: 0.78rem;
          color: var(--sh-text-secondary);
          font-weight: normal;
        }
      `}</style>
    </div>
  );
}
