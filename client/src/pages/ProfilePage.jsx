import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Calendar, 
  Building, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  Eye, 
  Clock 
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage({ onBack, onSelectListing, onEditListing, onCreateListing }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getProfile();
      if (res && res.success) {
        setProfileData(res);
      }
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await api.cancelBooking(bookingId);
      loadProfile();
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await api.deleteListing(listingId);
      loadProfile();
    } catch (err) {
      alert(err.message || "Failed to delete listing");
    }
  };

  if (loading) {
    return (
      <div className="sh-container" style={{ padding: "60px 24px", textAlign: "center" }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  const user = profileData?.user || currentUser;
  const listings = profileData?.listings || [];
  const bookings = profileData?.bookings || [];

  return (
    <div className="sh-container sh-profile-page">
      <div className="sh-profile-top-nav">
        <button className="sh-btn sh-btn-ghost sh-btn-sm" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to discovery</span>
        </button>
      </div>

      {error && <div className="sh-alert-error">{error}</div>}

      {/* User Hero Profile Card */}
      <div className="sh-profile-hero">
        <div className="sh-profile-avatar">
          {user ? user.username.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="sh-profile-info">
          <h2>{user ? user.username : "StayHub User"}</h2>
          <div className="sh-profile-email">
            <Mail size={16} />
            <span>{user ? user.email : "user@stayhub.in"}</span>
          </div>
          <div className="sh-profile-badges">
            <span className="sh-badge">Verified Member</span>
            <span className="sh-badge">{listings.length} Properties Hosted</span>
            <span className="sh-badge">{bookings.length} Reservations</span>
          </div>
        </div>
        <button className="sh-btn sh-btn-primary" onClick={onCreateListing}>
          <PlusCircle size={17} />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="sh-profile-tabs">
        <button
          className={`sh-profile-tab ${activeTab === "listings" ? "active" : ""}`}
          onClick={() => setActiveTab("listings")}
        >
          <Building size={18} />
          <span>My Hosted Listings ({listings.length})</span>
        </button>
        <button
          className={`sh-profile-tab ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <Calendar size={18} />
          <span>My Reservations ({bookings.length})</span>
        </button>
      </div>

      {/* Tab 1: Hosted Listings */}
      {activeTab === "listings" && (
        <div className="sh-tab-content">
          {listings.length === 0 ? (
            <div className="sh-profile-empty">
              <Building size={48} color="var(--sh-text-muted)" />
              <h3>You have not created any listings yet</h3>
              <p>Share your villa, farmhouse, or retreat with guests from across the country.</p>
              <button className="sh-btn sh-btn-primary" onClick={onCreateListing}>
                Host your first property
              </button>
            </div>
          ) : (
            <div className="sh-user-listings-grid">
              {listings.map((item) => (
                <div key={item._id} className="sh-user-listing-item">
                  <img
                    src={item.image?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"}
                    alt={item.title}
                    className="sh-item-thumb"
                  />
                  <div className="sh-item-details">
                    <h4>{item.title}</h4>
                    <p className="sh-item-location">{item.location}, {item.country}</p>
                    <p className="sh-item-price">
                      <strong>&#8377; {Number(item.price).toLocaleString("en-IN")}</strong> / night
                    </p>
                  </div>
                  <div className="sh-item-actions">
                    <button
                      className="sh-btn sh-btn-secondary sh-btn-sm"
                      onClick={() => onSelectListing(item._id)}
                      title="View public page"
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </button>
                    <button
                      className="sh-btn sh-btn-secondary sh-btn-sm"
                      onClick={() => onEditListing(item)}
                      title="Edit listing"
                    >
                      <Edit3 size={15} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="sh-btn sh-btn-danger sh-btn-sm"
                      onClick={() => handleDeleteListing(item._id)}
                      title="Delete listing"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reservations */}
      {activeTab === "bookings" && (
        <div className="sh-tab-content">
          {bookings.length === 0 ? (
            <div className="sh-profile-empty">
              <Calendar size={48} color="var(--sh-text-muted)" />
              <h3>No reservations booked</h3>
              <p>Explore our curated vacation rentals and plan your next peaceful stay.</p>
              <button className="sh-btn sh-btn-secondary" onClick={onBack}>
                Explore Accommodations
              </button>
            </div>
          ) : (
            <div className="sh-user-bookings-list">
              {bookings.map((b) => {
                const listingTitle = b.listing ? b.listing.title : "StayHub Accommodation";
                const listingImg = b.listing?.image?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";
                const startStr = b.startDate ? new Date(b.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
                const endStr = b.endDate ? new Date(b.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

                return (
                  <div key={b._id} className="sh-booking-card">
                    <img src={listingImg} alt={listingTitle} className="sh-booking-thumb" />
                    <div className="sh-booking-card-info">
                      <h4>{listingTitle}</h4>
                      <div className="sh-booking-dates">
                        <Clock size={16} color="var(--sh-text-secondary)" />
                        <span><strong>{startStr}</strong> &mdash; <strong>{endStr}</strong></span>
                      </div>
                      <span className="sh-badge" style={{ background: "var(--sh-success-bg)", color: "var(--sh-success)" }}>
                        Confirmed Reservation
                      </span>
                    </div>
                    <div className="sh-booking-actions">
                      {b.listing?._id && (
                        <button
                          className="sh-btn sh-btn-secondary sh-btn-sm"
                          onClick={() => onSelectListing(b.listing._id)}
                        >
                          View Property
                        </button>
                      )}
                      <button
                        className="sh-btn sh-btn-danger sh-btn-sm"
                        onClick={() => handleCancelBooking(b._id)}
                      >
                        Cancel Stay
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        .sh-profile-page {
          padding: 24px 24px 80px;
        }

        .sh-profile-top-nav {
          margin-bottom: 20px;
        }

        .sh-profile-hero {
          background: #FFFFFF;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-xl);
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: var(--sh-shadow-card);
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .sh-profile-avatar {
          width: 76px;
          height: 76px;
          border-radius: var(--sh-radius-full);
          background: var(--sh-primary);
          color: #FFFFFF;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sh-profile-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sh-profile-info h2 {
          font-size: 1.6rem;
        }

        .sh-profile-email {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--sh-text-secondary);
          font-size: 0.95rem;
        }

        .sh-profile-badges {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        /* Tabs */
        .sh-profile-tabs {
          display: flex;
          border-bottom: 1px solid var(--sh-border-light);
          margin-bottom: 28px;
        }

        .sh-profile-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--sh-text-secondary);
          border-bottom: 2px solid transparent;
          transition: all var(--sh-transition-fast);
          cursor: pointer;
        }

        .sh-profile-tab:hover {
          color: var(--sh-text-primary);
        }

        .sh-profile-tab.active {
          color: var(--sh-primary);
          border-bottom-color: var(--sh-primary);
        }

        .sh-profile-empty {
          text-align: center;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          max-width: 440px;
          margin: 0 auto;
        }

        .sh-profile-empty h3 {
          font-size: 1.25rem;
        }

        .sh-profile-empty p {
          font-size: 0.92rem;
          margin-bottom: 8px;
        }

        /* Listings Grid */
        .sh-user-listings-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sh-user-listing-item {
          background: #FFFFFF;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-lg);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: box-shadow var(--sh-transition-fast);
        }

        .sh-user-listing-item:hover {
          box-shadow: var(--sh-shadow-md);
        }

        .sh-item-thumb {
          width: 90px;
          height: 70px;
          border-radius: var(--sh-radius-md);
          object-fit: cover;
          flex-shrink: 0;
        }

        .sh-item-details {
          flex: 1;
        }

        .sh-item-details h4 {
          font-size: 1.05rem;
          margin-bottom: 4px;
        }

        .sh-item-location {
          font-size: 0.85rem;
          color: var(--sh-text-secondary);
        }

        .sh-item-price {
          font-size: 0.9rem;
          margin-top: 4px;
        }

        .sh-item-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Bookings List */
        .sh-user-bookings-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sh-booking-card {
          background: #FFFFFF;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-lg);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .sh-booking-thumb {
          width: 110px;
          height: 80px;
          border-radius: var(--sh-radius-md);
          object-fit: cover;
        }

        .sh-booking-card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 240px;
        }

        .sh-booking-dates {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--sh-text-primary);
        }

        .sh-booking-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
