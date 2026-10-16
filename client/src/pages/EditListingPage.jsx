import React, { useState } from "react";
import { ArrowLeft, Upload, Check } from "lucide-react";
import { api } from "../services/api";

const AVAILABLE_CATEGORIES = [
  "Trending",
  "Bed&Breakfast",
  "icons",
  "Lake",
  "Beach",
  "OMG",
  "Farm",
  "Arctic",
];

const AVAILABLE_FEATURES = [
  "Free Parking",
  "WiFi",
  "Hot Water",
  "24 hrs Electricity",
  "Security Guard",
  "Balcony",
  "Kitchen",
  "Gym",
  "Furniture",
];

export default function EditListingPage({ listing, onBack, onSuccess }) {
  if (!listing) {
    return (
      <div className="sh-container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h3>Accommodation not found</h3>
        <p style={{ marginTop: "8px", marginBottom: "20px" }}>No property data was provided to edit.</p>
        <button className="sh-btn sh-btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to properties</span>
        </button>
      </div>
    );
  }

  const [title, setTitle] = useState(listing?.title || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [price, setPrice] = useState(listing?.price !== undefined ? listing.price : "");
  const [location, setLocation] = useState(listing?.location || "");
  const [country, setCountry] = useState(listing?.country || "India");
  const [category, setCategory] = useState(listing?.category || "Trending");
  const [selectedFeatures, setSelectedFeatures] = useState(listing?.features || []);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const originalImageUrl = listing?.image ? listing.image.url : "";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleFeature = (feat) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("listing[title]", title);
      formData.append("listing[description]", description);
      formData.append("listing[price]", price);
      formData.append("listing[location]", location);
      formData.append("listing[country]", country);
      formData.append("listing[category]", category);

      selectedFeatures.forEach((feat) => {
        formData.append("listing[features]", feat);
      });

      if (imageFile) {
        formData.append("listing[image]", imageFile);
      }

      const res = await api.updateListing(listing._id, formData);
      if (res && res.success) {
        if (onSuccess) onSuccess(res.listing);
      }
    } catch (err) {
      setError(err.message || "Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sh-container sh-form-page">
      <div className="sh-form-header">
        <button className="sh-btn sh-btn-ghost sh-btn-sm" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to property</span>
        </button>
        <h1>Edit Accommodation</h1>
        <p>Update property details, amenities, or pricing.</p>
      </div>

      {error && <div className="sh-alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="sh-listing-form">
        <div className="sh-form-card">
          <h3>Basic Details</h3>
          
          <div className="sh-form-group">
            <label className="sh-label" htmlFor="edit-title">Property Title *</label>
            <input
              id="edit-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sh-input"
            />
          </div>

          <div className="sh-form-group">
            <label className="sh-label" htmlFor="edit-desc">Description *</label>
            <textarea
              id="edit-desc"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="sh-textarea"
            />
          </div>

          <div className="sh-form-row">
            <div className="sh-form-group">
              <label className="sh-label" htmlFor="edit-price">Price per night (INR &#8377;) *</label>
              <input
                id="edit-price"
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="sh-input"
              />
            </div>

            <div className="sh-form-group">
              <label className="sh-label" htmlFor="edit-category">Category *</label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="sh-select"
              >
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="sh-form-card">
          <h3>Location</h3>

          <div className="sh-form-row">
            <div className="sh-form-group" style={{ flex: 2 }}>
              <label className="sh-label" htmlFor="edit-loc">City / Destination *</label>
              <input
                id="edit-loc"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="sh-input"
              />
            </div>

            <div className="sh-form-group" style={{ flex: 1 }}>
              <label className="sh-label" htmlFor="edit-country">Country *</label>
              <input
                id="edit-country"
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="sh-input"
              />
            </div>
          </div>
        </div>

        {/* Current Image & Upload Replacement */}
        <div className="sh-form-card">
          <h3>Property Photo</h3>
          
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "16px" }}>
            {originalImageUrl && !previewUrl && (
              <div>
                <span className="sh-label" style={{ display: "block", marginBottom: "6px" }}>Current Photo</span>
                <img
                  src={originalImageUrl}
                  alt="Original listing"
                  style={{ width: "200px", height: "130px", objectFit: "cover", borderRadius: "10px" }}
                />
              </div>
            )}
            {previewUrl && (
              <div>
                <span className="sh-label" style={{ display: "block", marginBottom: "6px" }}>Replacement Preview</span>
                <img
                  src={previewUrl}
                  alt="New preview"
                  style={{ width: "200px", height: "130px", objectFit: "cover", borderRadius: "10px" }}
                />
              </div>
            )}
          </div>

          <label className="sh-drop-label" style={{ border: "2px dashed var(--sh-border)", padding: "20px", borderRadius: "12px" }}>
            <Upload size={24} color="var(--sh-primary)" />
            <span>Click to upload a replacement photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sh-file-input"
            />
          </label>
        </div>

        {/* Amenities */}
        <div className="sh-form-card">
          <h3>Amenities &amp; Features</h3>

          <div className="sh-features-checklist">
            {AVAILABLE_FEATURES.map((feat) => {
              const checked = selectedFeatures.includes(feat);
              return (
                <button
                  type="button"
                  key={feat}
                  className={`sh-feature-checkbox ${checked ? "checked" : ""}`}
                  onClick={() => toggleFeature(feat)}
                  aria-pressed={checked}
                >
                  <div className={`sh-check-box ${checked ? "checked" : ""}`}>
                    {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span>{feat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sh-form-footer">
          <button type="button" className="sh-btn sh-btn-ghost" onClick={onBack}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="sh-btn sh-btn-primary sh-btn-lg"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>

      <style>{`
        .sh-form-page {
          max-width: 780px;
          padding: 32px 24px 80px;
        }

        .sh-form-header {
          margin-bottom: 28px;
        }

        .sh-form-header h1 {
          font-size: 1.8rem;
          margin-top: 12px;
          margin-bottom: 6px;
        }

        .sh-form-header p {
          color: var(--sh-text-secondary);
        }

        .sh-listing-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sh-form-card {
          background: #FFFFFF;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-xl);
          padding: 28px;
          box-shadow: var(--sh-shadow-card);
        }

        .sh-form-card h3 {
          font-size: 1.15rem;
          margin-bottom: 16px;
        }

        .sh-form-row {
          display: flex;
          gap: 16px;
        }

        .sh-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .sh-form-group:last-child {
          margin-bottom: 0;
        }

        .sh-drop-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background-color var(--sh-transition-fast), border-color var(--sh-transition-fast);
        }

        .sh-drop-label:hover {
          background-color: var(--sh-bg-subtle);
          border-color: var(--sh-primary) !important;
        }

        .sh-file-input {
          display: none;
        }

        .sh-features-checklist {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        .sh-feature-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--sh-bg-subtle);
          border: 1px solid var(--sh-border-light);
          padding: 10px 14px;
          border-radius: var(--sh-radius-md);
          cursor: pointer;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--sh-text-primary);
          transition: all var(--sh-transition-fast);
        }

        .sh-feature-checkbox:hover {
          border-color: var(--sh-border);
          background: #FFFFFF;
        }

        .sh-feature-checkbox.checked {
          background: var(--sh-primary-light);
          border-color: var(--sh-primary);
          color: var(--sh-primary);
        }

        .sh-check-box {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1.5px solid var(--sh-border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--sh-transition-fast);
        }

        .sh-check-box.checked {
          background: var(--sh-primary);
          border-color: var(--sh-primary);
        }

        .sh-form-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 12px;
        }

        @media (max-width: 640px) {
          .sh-form-row {
            flex-direction: column;
          }
          .sh-features-checklist {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
