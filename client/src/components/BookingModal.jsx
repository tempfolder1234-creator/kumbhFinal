import React, { useState } from "react";
import { X, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BookingModal({ listing, onClose, onSuccess, onOpenAuth }) {
  const { currentUser } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Calculate nights
  let nights = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  const validNights = nights > 0 ? nights : 1;
  const basePrice = Number(listing.price) || 0;
  const subtotal = basePrice * validNights;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select both check-in and check-out dates");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("Check-out date must be after check-in date");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.createBooking(listing._id, { startDate, endDate });
      if (res && res.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.booking);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Failed to confirm reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sh-modal-backdrop" onClick={onClose}>
      <div className="sh-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="sh-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {success ? (
          <div className="sh-booking-success">
            <CheckCircle2 size={54} color="var(--sh-success)" />
            <h3>Reservation Confirmed!</h3>
            <p>Your stay at <strong>{listing.title}</strong> has been secured.</p>
            <p className="sh-text-secondary">Redirecting to your reservations...</p>
          </div>
        ) : (
          <>
            <div className="sh-booking-header">
              <h3>Reserve your stay</h3>
              <p className="sh-booking-subtitle">{listing.title} &middot; {listing.location}</p>
            </div>

            {error && <div className="sh-alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="sh-booking-form">
              <div className="sh-date-inputs">
                <div className="sh-date-field">
                  <label htmlFor="sh-checkin" className="sh-label">CHECK-IN</label>
                  <input
                    id="sh-checkin"
                    type="date"
                    required
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="sh-input"
                  />
                </div>
                <div className="sh-date-field">
                  <label htmlFor="sh-checkout" className="sh-label">CHECKOUT</label>
                  <input
                    id="sh-checkout"
                    type="date"
                    required
                    value={endDate}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="sh-input"
                  />
                </div>
              </div>

              <div className="sh-form-group">
                <label htmlFor="sh-upi" className="sh-label">UPI ID / Transaction Reference</label>
                <input
                  id="sh-upi"
                  type="text"
                  placeholder="e.g. yourname@okaxis / Ref ID"
                  required
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  className="sh-input"
                />
              </div>

              {/* Price Breakdown */}
              <div className="sh-price-breakdown">
                <div className="sh-breakdown-row">
                  <span>&#8377; {basePrice.toLocaleString("en-IN")} &times; {validNights} night{validNights > 1 ? "s" : ""}</span>
                  <span>&#8377; {subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="sh-breakdown-row">
                  <span>Goods &amp; Services Tax (18% GST)</span>
                  <span>&#8377; {gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="sh-breakdown-divider" />
                <div className="sh-breakdown-total">
                  <span>Total (INR)</span>
                  <strong>&#8377; {total.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="sh-btn sh-btn-primary sh-btn-lg"
                style={{ width: "100%", marginTop: "12px" }}
              >
                {loading ? "Confirming..." : (currentUser ? "Confirm Reservation" : "Log in to Reserve")}
              </button>

              <div className="sh-guarantee-note">
                <ShieldCheck size={16} color="var(--sh-success)" />
                <span>StayHub Protected: Free cancellation up to 48 hours prior</span>
              </div>
            </form>
          </>
        )}
      </div>

      <style>{`
        .sh-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--sh-text-secondary);
          width: 32px;
          height: 32px;
          border-radius: var(--sh-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--sh-transition-fast);
        }

        .sh-modal-close:hover {
          background: var(--sh-bg-hover);
          color: var(--sh-text-primary);
        }

        .sh-booking-header {
          margin-bottom: 20px;
        }

        .sh-booking-subtitle {
          font-size: 0.9rem;
          color: var(--sh-text-secondary);
          margin-top: 4px;
        }

        .sh-date-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .sh-price-breakdown {
          background: #FAFAFA;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-md);
          padding: 16px;
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sh-breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--sh-text-secondary);
        }

        .sh-breakdown-divider {
          height: 1px;
          background: var(--sh-border-light);
          margin: 4px 0;
        }

        .sh-breakdown-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--sh-text-primary);
        }

        .sh-alert-error {
          padding: 10px 14px;
          background: var(--sh-error-bg);
          color: var(--sh-error);
          border-radius: var(--sh-radius-sm);
          font-size: 0.875rem;
          margin-bottom: 16px;
        }

        .sh-guarantee-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: var(--sh-text-secondary);
          margin-top: 16px;
        }

        .sh-booking-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 16px;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
