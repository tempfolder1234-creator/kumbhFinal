import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Star,
  Share2,
  Heart,
  Edit3,
  Trash2,
  UserCheck,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { DetailSkeleton } from "../components/LoadingSkeleton";
import FeatureBadge from "../components/FeatureBadge";
import MapboxView from "../components/MapboxView";
import BookingModal from "../components/BookingModal";
import ReviewSection from "../components/ReviewSection";

export default function ListingDetailPage({ listingId, onBack, onEdit, onDeleted, onOpenAuth }) {
  const { currentUser } = useAuth();
  const [listing, setListing] = useState(null);
  const [mapToken, setMapToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const [listingRes, configRes] = await Promise.all([
          api.getListingById(listingId),
          api.getConfig().catch(() => ({ mapToken: "" })),
        ]);

        if (listingRes && listingRes.success) {
          setListing(listingRes.listing);
        }
        if (configRes && configRes.mapToken) {
          setMapToken(configRes.mapToken);
        }
      } catch (err) {
        setError(err.message || "Failed to load listing details");
      } finally {
        setLoading(false);
      }
    }
    if (listingId) loadData();
  }, [listingId]);

  if (loading) return <DetailSkeleton />;

  if (error || !listing) {
    return (
      <div className="sh-container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h3>Property not found</h3>
        <p style={{ marginTop: "8px", marginBottom: "20px" }}>{error || "The requested listing does not exist."}</p>
        <button className="sh-btn sh-btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to discovery</span>
        </button>
      </div>
    );
  }

  const isOwner = currentUser && listing.owner && String(listing.owner._id || listing.owner) === String(currentUser._id);
  const fallbackImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";
  const displayImage = (!imgError && listing.image && listing.image.url) ? listing.image.url : fallbackImage;
  const basePrice = Number(listing.price) || 0;

  // Review stats
  const reviews = listing.reviews || [];
  let avgRating = "5.0";
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    avgRating = (sum / reviews.length).toFixed(1);
  }

  const handleDeleteListing = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await api.deleteListing(listing._id);
      if (onDeleted) onDeleted(listing._id);
    } catch (err) {
      alert(err.message || "Failed to delete listing");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="sh-detail-page">
      <div className="sh-container">
        {/* Navigation & Header */}
        <div className="sh-detail-nav">
          <button className="sh-btn sh-btn-ghost sh-btn-sm" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>All Stays</span>
          </button>

          <div className="sh-detail-actions">
            <button className="sh-btn sh-btn-ghost sh-btn-sm" onClick={handleShare}>
              <Share2 size={16} />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
            {isOwner && (
              <>
                <button className="sh-btn sh-btn-secondary sh-btn-sm" onClick={() => onEdit(listing)}>
                  <Edit3 size={15} />
                  <span>Edit</span>
                </button>
                <button className="sh-btn sh-btn-danger sh-btn-sm" onClick={handleDeleteListing}>
                  <Trash2 size={15} />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="sh-detail-header">
          <h1 className="sh-detail-title">{listing.title}</h1>
          <div className="sh-detail-subtitle">
            <div className="sh-detail-rating">
              <Star size={16} fill="#222222" color="#222222" />
              <span>{avgRating}</span>
              <span className="sh-reviews-link">({reviews.length} reviews)</span>
            </div>
            <span className="sh-dot">&middot;</span>
            <div className="sh-detail-loc">
              <MapPin size={15} />
              <span>{listing.location}, {listing.country}</span>
            </div>
            {listing.category && (
              <>
                <span className="sh-dot">&middot;</span>
                <span className="sh-badge">{listing.category}</span>
              </>
            )}
          </div>
        </div>

        {/* Hero Image Showcase */}
        <div className="sh-detail-gallery">
          <img
            src={displayImage}
            alt={listing.title}
            className="sh-gallery-main"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Main 2-Column Content */}
        <div className="sh-detail-body">
          {/* Left Column: Details, Features, Map */}
          <div className="sh-detail-left">
            <div className="sh-host-banner">
              <div>
                <h2>Entire accommodation hosted by {listing.owner ? listing.owner.username : "Host"}</h2>
                <p>Private retreat in scenic {listing.location} &middot; Verified Host</p>
              </div>
              <div className="sh-host-avatar">
                {listing.owner ? listing.owner.username.charAt(0).toUpperCase() : "H"}
              </div>
            </div>

            <div className="sh-section-divider" />

            {/* Description */}
            <div className="sh-detail-section">
              <h3>About this accommodation</h3>
              <p className="sh-description-text">{listing.description}</p>
            </div>

            <div className="sh-section-divider" />

            {/* Amenities & Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="sh-detail-section">
                <h3>What this place offers</h3>
                <div className="sh-features-grid">
                  {listing.features.map((feature, idx) => (
                    <FeatureBadge key={idx} name={feature} />
                  ))}
                </div>
              </div>
            )}

            <div className="sh-section-divider" />

            {/* Map Section */}
            <div className="sh-detail-section">
              <h3>Where you will be</h3>
              <p className="sh-map-sub">{listing.location}, {listing.country}</p>
              <MapboxView
                coordinates={listing.geometry ? listing.geometry.coordinates : null}
                title={listing.title}
                locationName={`${listing.location}, ${listing.country}`}
                mapToken={mapToken}
              />
            </div>

            {/* Reviews Section */}
            <ReviewSection
              listingId={listing._id}
              reviews={reviews}
              onReviewAdded={(newRev) => {
                setListing({
                  ...listing,
                  reviews: [newRev, ...listing.reviews],
                });
              }}
              onReviewDeleted={(revId) => {
                setListing({
                  ...listing,
                  reviews: listing.reviews.filter((r) => r._id !== revId),
                });
              }}
              onOpenAuth={onOpenAuth}
            />
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="sh-detail-right">
            <div className="sh-booking-widget">
              <div className="sh-widget-header">
                <div className="sh-widget-price">
                  <strong>&#8377; {basePrice.toLocaleString("en-IN")}</strong>
                  <span> / night</span>
                </div>
                <div className="sh-widget-rating">
                  <Star size={14} fill="#222222" color="#222222" />
                  <span>{avgRating}</span>
                </div>
              </div>

              <div className="sh-widget-card-box">
                <div className="sh-widget-dates-trigger" onClick={() => setIsBookingOpen(true)}>
                  <Calendar size={18} color="var(--sh-text-secondary)" />
                  <div>
                    <span className="sh-widget-date-label">RESERVATION DATES</span>
                    <span className="sh-widget-date-val">Select check-in &amp; check-out</span>
                  </div>
                </div>
              </div>

              <button
                className="sh-btn sh-btn-primary sh-btn-lg"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={() => setIsBookingOpen(true)}
              >
                Reserve Stay
              </button>

              <p className="sh-widget-note">You will not be charged yet</p>

              <div className="sh-widget-calc">
                <div className="sh-calc-row">
                  <span>Standard Rate</span>
                  <span>&#8377; {basePrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="sh-calc-row">
                  <span>Goods &amp; Services Tax (18% GST)</span>
                  <span>&#8377; {Math.round(basePrice * 0.18).toLocaleString("en-IN")}</span>
                </div>
                <div className="sh-calc-divider" />
                <div className="sh-calc-total">
                  <span>Total before discounts</span>
                  <strong>&#8377; {Math.round(basePrice * 1.18).toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="sh-widget-guarantee">
                <ShieldCheck size={18} color="var(--sh-success)" />
                <span>StayHub Guest Guarantee: verified listing quality &amp; host support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          listing={listing}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={() => {
            setIsBookingOpen(false);
            onBack();
          }}
          onOpenAuth={onOpenAuth}
        />
      )}

      <style>{`
        .sh-detail-page {
          padding: 24px 0 60px;
        }

        .sh-detail-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .sh-detail-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sh-detail-header {
          margin-bottom: 24px;
        }

        .sh-detail-title {
          font-size: 1.85rem;
          margin-bottom: 8px;
        }

        .sh-detail-subtitle {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9375rem;
          color: var(--sh-text-secondary);
          flex-wrap: wrap;
        }

        .sh-detail-rating, .sh-detail-loc {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--sh-text-primary);
          font-weight: 600;
        }

        .sh-reviews-link {
          color: var(--sh-text-secondary);
          text-decoration: underline;
        }

        /* Gallery */
       
.sh-detail-gallery {
  width: 70%;
  max-width: 800px;
  border-radius: var(--sh-radius-xl);
  overflow: hidden;
  background: #EAEAEA;
  box-shadow: var(--sh-shadow-card);
  margin: 0 auto 36px;
}

.sh-gallery-main {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
}

        /* Layout */
        .sh-detail-body {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 64px;
          align-items: start;
        }

        .sh-host-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .sh-host-banner h2 {
          font-size: 1.35rem;
          margin-bottom: 4px;
        }

        .sh-host-avatar {
          width: 52px;
          height: 52px;
          border-radius: var(--sh-radius-full);
          background: var(--sh-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .sh-section-divider {
          height: 1px;
          background: var(--sh-border-light);
          margin: 32px 0;
        }

        .sh-detail-section h3 {
          font-size: 1.25rem;
          margin-bottom: 16px;
        }

        .sh-description-text {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--sh-text-primary);
          white-space: pre-line;
        }

        .sh-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .sh-map-sub {
          margin-top: -8px;
          margin-bottom: 16px;
          font-size: 0.95rem;
          color: var(--sh-text-secondary);
        }

        /* Sticky Booking Widget */
        .sh-detail-right {
          position: sticky;
          top: calc(var(--sh-header-height) + 24px);
        }

        .sh-booking-widget {
          background: #FFFFFF;
          border: 1px solid var(--sh-border);
          border-radius: var(--sh-radius-xl);
          padding: 28px;
          box-shadow: var(--sh-shadow-md);
        }

        .sh-widget-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .sh-widget-price strong {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--sh-text-primary);
        }

        .sh-widget-price span {
          color: var(--sh-text-secondary);
          font-size: 0.95rem;
        }

        .sh-widget-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .sh-widget-card-box {
          border: 1px solid var(--sh-border);
          border-radius: var(--sh-radius-md);
          overflow: hidden;
        }

        .sh-widget-dates-trigger {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          background: #FAFAFA;
          transition: background var(--sh-transition-fast);
        }

        .sh-widget-dates-trigger:hover {
          background: #F1F1F1;
        }

        .sh-widget-date-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--sh-text-secondary);
          letter-spacing: 0.05em;
        }

        .sh-widget-date-val {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--sh-text-primary);
        }

        .sh-widget-note {
          text-align: center;
          font-size: 0.8125rem;
          color: var(--sh-text-secondary);
          margin-top: 12px;
        }

        .sh-widget-calc {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--sh-border-light);
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--sh-text-secondary);
        }

        .sh-calc-row {
          display: flex;
          justify-content: space-between;
        }

        .sh-calc-divider {
          height: 1px;
          background: var(--sh-border-light);
          margin: 6px 0;
        }

        .sh-calc-total {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          font-weight: 700;
          color: var(--sh-text-primary);
        }

        .sh-widget-guarantee {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--sh-border-light);
          font-size: 0.78rem;
          color: var(--sh-text-secondary);
          line-height: 1.4;
        }

        @media (max-width: 992px) {
          .sh-detail-body {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .sh-detail-right {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
