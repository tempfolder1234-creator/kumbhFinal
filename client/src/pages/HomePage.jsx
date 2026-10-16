import React, { useState, useEffect, useRef } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ListingCard from "../components/ListingCard";
import EmptyState from "../components/EmptyState";
import { GridSkeleton } from "../components/LoadingSkeleton";
import { api } from "../services/api";

export default function HomePage({ onSelectListing, searchQuery, setSearchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showTax, setShowTax] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reqIdRef = useRef(0);

  const loadListings = async (category = selectedCategory, search = searchQuery) => {
    const currentReqId = ++reqIdRef.current;
    try {
      setLoading(true);
      setError("");
      const res = await api.getListings({ category, search });
      if (currentReqId === reqIdRef.current && res && res.success) {
        setListings(res.listings || []);
      }
    } catch (err) {
      if (currentReqId === reqIdRef.current) {
        console.error("Error loading listings:", err);
        setError(err.message || "Failed to load listings");
      }
    } finally {
      if (currentReqId === reqIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Debounce search input by 200ms to eliminate network race conditions and UI flicker
    const timer = setTimeout(() => {
      loadListings(selectedCategory, searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <div className="sh-homepage">
      {/* Category Filter Bar */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        showTax={showTax}
        setShowTax={setShowTax}
      />

      {/* Main Content Area */}
      <main className="sh-container sh-content-area">
        {/* Search / Filter Context Indicator */}
        {(selectedCategory !== "All" || (searchQuery && searchQuery.trim())) && (
          <div className="sh-filter-status">
            <span>
              Showing {listings.length} stays
              {searchQuery && <> matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</>}
              {selectedCategory !== "All" && <> in <strong>{selectedCategory}</strong></>}
            </span>
            <button className="sh-clear-link" onClick={handleReset}>
              Clear filters
            </button>
          </div>
        )}

        {loading ? (
          <GridSkeleton count={8} />
        ) : error ? (
          <div className="sh-error-banner">
            <p>{error}</p>
            <button className="sh-btn sh-btn-secondary" onClick={() => loadListings()}>
              Try again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            title="No accommodations found"
            message={
              searchQuery 
                ? `No stays matched "${searchQuery}". Try searching for another city, district, or clear your filters.`
                : "No stays currently available in this category."
            }
            onReset={handleReset}
          />
        ) : (
          <div className="sh-grid-listings">
            {listings.map((item) => (
              <ListingCard
                key={item._id}
                listing={item}
                onClick={onSelectListing}
                showTax={showTax}
              />
            ))}
          </div>
        )}
      </main>

      <style>{`
        .sh-homepage {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .sh-content-area {
          padding-top: 16px;
          flex: 1;
        }

        .sh-filter-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0 6px;
          font-size: 0.95rem;
          color: var(--sh-text-secondary);
        }

        .sh-clear-link {
          font-weight: 600;
          text-decoration: underline;
          color: var(--sh-text-primary);
          font-size: 0.875rem;
        }

        .sh-error-banner {
          text-align: center;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--sh-error);
        }
      `}</style>
    </div>
  );
}
