import React, { useState } from "react";
import { Star, Trash2, Send, MessageSquare } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ReviewSection({ listingId, reviews = [], onReviewAdded, onReviewDeleted, onOpenAuth }) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment for your review");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      // Model expects Comment: String and rating: String
      const res = await api.addReview(listingId, { rating: String(rating), Comment: comment.trim() });
      if (res && res.success) {
        setComment("");
        setRating(5);
        if (onReviewAdded) onReviewAdded(res.review);
      }
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.deleteReview(listingId, reviewId);
      if (onReviewDeleted) onReviewDeleted(reviewId);
    } catch (err) {
      alert(err.message || "Failed to delete review");
    }
  };

  return (
    <div className="sh-reviews-container">
      <div className="sh-reviews-header">
        <div className="sh-reviews-title">
          <Star size={24} fill="var(--sh-text-primary)" color="var(--sh-text-primary)" />
          <h3>Reviews &middot; {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</h3>
        </div>
      </div>

      {/* Review Submission Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="sh-review-form">
          <h4>Leave a review</h4>
          {error && <div className="sh-alert-error">{error}</div>}

          {/* Interactive Star Picker */}
          <div className="sh-star-picker">
            <span className="sh-label">Rating:</span>
            <div className="sh-stars-row">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = (hoverRating || rating) >= starVal;
                return (
                  <button
                    type="button"
                    key={starVal}
                    className="sh-star-btn"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${starVal} star`}
                  >
                    <Star
                      size={24}
                      fill={isFilled ? "#FF385C" : "none"}
                      color={isFilled ? "#FF385C" : "#B0B0B0"}
                    />
                  </button>
                );
              })}
            </div>
            <span className="sh-rating-desc">
              {rating === 5 ? "Amazing" : rating === 4 ? "Very good" : rating === 3 ? "Average" : rating === 2 ? "Not good" : "Terrible"}
            </span>
          </div>

          <div className="sh-form-group">
            <label htmlFor="sh-comment" className="sh-label">Your experience</label>
            <textarea
              id="sh-comment"
              rows={4}
              placeholder="What made your stay special? Describe the hospitality, cleanliness, and ambiance..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="sh-textarea"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="sh-btn sh-btn-primary"
            style={{ alignSelf: "flex-start" }}
          >
            <Send size={16} />
            <span>{submitting ? "Submitting..." : "Submit Review"}</span>
          </button>
        </form>
      ) : (
        <div className="sh-review-login-prompt">
          <MessageSquare size={24} color="var(--sh-text-secondary)" />
          <div>
            <p>Have you stayed here? <strong>Log in</strong> to share your experience with other travelers.</p>
          </div>
          <button className="sh-btn sh-btn-secondary sh-btn-sm" onClick={() => onOpenAuth && onOpenAuth("login")}>
            Log In
          </button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="sh-reviews-grid">
          {reviews.map((rev) => {
            const authorName = rev.author ? rev.author.username : "Guest";
            const isAuthor = currentUser && rev.author && String(rev.author._id || rev.author) === String(currentUser._id);
            const revDate = rev.Date ? new Date(rev.Date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Recently";
            const rScore = Number(rev.rating) || 5;

            return (
              <div key={rev._id} className="sh-review-card">
                <div className="sh-review-card-header">
                  <div className="sh-review-author-avatar">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="sh-review-meta">
                    <strong>@{authorName}</strong>
                    <span>{revDate}</span>
                  </div>
                  {isAuthor && (
                    <button
                      className="sh-review-del-btn"
                      onClick={() => handleDelete(rev._id)}
                      title="Delete your review"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="sh-review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < rScore ? "#222222" : "none"}
                      color={i < rScore ? "#222222" : "#DDDDDD"}
                    />
                  ))}
                </div>

                <p className="sh-review-text">{rev.Comment}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sh-no-reviews">
          <p>No reviews yet for this property. Be the first to leave one!</p>
        </div>
      )}

      <style>{`
        .sh-reviews-container {
          padding-top: 32px;
          margin-top: 32px;
          border-top: 1px solid var(--sh-border-light);
        }

        .sh-reviews-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .sh-reviews-title h3 {
          font-size: 1.3rem;
        }

        .sh-review-form {
          background: #FAFAFA;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-lg);
          padding: 24px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sh-star-picker {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sh-stars-row {
          display: flex;
          gap: 4px;
        }

        .sh-star-btn {
          padding: 2px;
          cursor: pointer;
          display: flex;
        }

        .sh-rating-desc {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--sh-primary);
        }

        .sh-review-login-prompt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--sh-bg-subtle);
          border-radius: var(--sh-radius-md);
          margin-bottom: 32px;
          gap: 16px;
        }

        .sh-review-login-prompt p {
          color: var(--sh-text-primary);
          font-size: 0.9rem;
        }

        .sh-reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .sh-review-card {
          background: #FFFFFF;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sh-review-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sh-review-author-avatar {
          width: 38px;
          height: 38px;
          border-radius: var(--sh-radius-full);
          background: var(--sh-primary-light);
          color: var(--sh-primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .sh-review-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          font-size: 0.85rem;
        }

        .sh-review-meta span {
          color: var(--sh-text-secondary);
          font-size: 0.78rem;
        }

        .sh-review-del-btn {
          color: var(--sh-text-muted);
          padding: 6px;
          border-radius: var(--sh-radius-full);
          transition: all var(--sh-transition-fast);
        }

        .sh-review-del-btn:hover {
          color: var(--sh-error);
          background: var(--sh-error-bg);
        }

        .sh-review-stars {
          display: flex;
          gap: 2px;
        }

        .sh-review-text {
          font-size: 0.92rem;
          color: var(--sh-text-primary);
          line-height: 1.5;
        }

        .sh-no-reviews {
          color: var(--sh-text-secondary);
          font-style: italic;
          padding: 20px 0;
        }
      `}</style>
    </div>
  );
}
