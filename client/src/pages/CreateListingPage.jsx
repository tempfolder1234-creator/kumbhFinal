import React, { useState } from "react";
import { ArrowLeft, Upload, Check, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

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

export default function CreateListingPage({ onBack, onSuccess, onOpenAuth }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("India");
  const [category, setCategory] = useState("Trending");
  const [selectedFeatures, setSelectedFeatures] = useState(["WiFi", "Hot Water"]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    if (!title || !description || !price || !location || !country) {
      setError("Please fill in all required fields.");
      return;
    }

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

      const res = await api.createListing(formData);
      if (res && res.success) {
        if (onSuccess) onSuccess(res.listing);
      }
    } catch (err) {
      setError(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sh-container sh-form-page">
      <div className="sh-form-header">
        <button className="sh-btn sh-btn-ghost sh-btn-sm" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h1>Host your accommodation on StayHub</h1>
        <p>List your stay for travelers visiting Nashik and surrounding regions.</p>
      </div>

      {!currentUser && (
        <div className="sh-login-alert">
          <AlertCircle size={20} />
          <div>
            <strong>You need to be logged in to create a listing.</strong>
            <p>Please log in or sign up before submitting.</p>
          </div>
          <button className="sh-btn sh-btn-primary sh-btn-sm" onClick={() => onOpenAuth && onOpenAuth("login")}>
            Log In Now
          </button>
        </div>
      )}

      {error && <div className="sh-alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="sh-listing-form">
        {/* Section 1: Basic Information */}
        <div className="sh-form-card">
          <h3>Basic Details</h3>
          
          <div className="sh-form-group">
            <label className="sh-label" htmlFor="listing-title">Property Title *</label>
            <input
              id="listing-title"
              type="text"
              required
              placeholder="e.g. Luxurious Vineyard Villa overlooking Gangapur Dam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sh-input"
            />
          </div>

          <div className="sh-form-group">
            <label className="sh-label" htmlFor="listing-desc">Description *</label>
            <textarea
              id="listing-desc"
              required
              rows={5}
              placeholder="Detail your accommodation's ambiance, surrounding nature, rooms, and peaceful atmosphere..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="sh-textarea"
            />
          </div>

          <div className="sh-form-row">
            <div className="sh-form-group">
              <label className="sh-label" htmlFor="listing-price">Price per night (INR &#8377;) *</label>
              <input
                id="listing-price"
                type="number"
                required
                min={1}
                placeholder="e.g. 3500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="sh-input"
              />
            </div>

            <div className="sh-form-group">
              <label className="sh-label" htmlFor="listing-category">Category *</label>
              <select
                id="listing-category"
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

        {/* Section 2: Location */}
        <div className="sh-form-card">
          <h3>Location</h3>

          <div className="sh-form-row">
            <div className="sh-form-group" style={{ flex: 2 }}>
              <label className="sh-label" htmlFor="listing-loc">City / Destination *</label>
              <input
                id="listing-loc"
                type="text"
                required
                placeholder="e.g. Nashik, Trimbakeshwar, or Igatpuri"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="sh-input"
              />
            </div>

            <div className="sh-form-group" style={{ flex: 1 }}>
              <label className="sh-label" htmlFor="listing-country">Country *</label>
              <input
                id="listing-country"
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="sh-input"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Photo Upload */}
        <div className="sh-form-card">
          <h3>Property Photo</h3>
          <p className="sh-form-subtext">Upload a high-resolution photo showcasing your stay.</p>

          <div className="sh-upload-zone">
            {previewUrl ? (
              <div className="sh-preview-wrap">
                <img src={previewUrl} alt="Listing preview" className="sh-preview-img" />
                <button
                  type="button"
                  className="sh-btn sh-btn-secondary sh-btn-sm"
                  onClick={() => { setImageFile(null); setPreviewUrl(""); }}
                >
                  Change photo
                </button>
              </div>
            ) : (
              <label className="sh-drop-label">
                <Upload size={32} color="var(--sh-primary)" />
                <span>Drag &amp; drop or click to upload photo</span>
                <span className="sh-drop-hint">Supports JPG, PNG, WEBP &middot; Cloudinary stored</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sh-file-input"
                />
              </label>
            )}
          </div>
        </div>

        {/* Section 4: Amenities & Features */}
        <div className="sh-form-card">
          <h3>Amenities &amp; Features</h3>
          <p className="sh-form-subtext">Select all amenities available to guests at your property.</p>

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
            disabled={loading || !currentUser}
            className="sh-btn sh-btn-primary sh-btn-lg"
          >
            {loading ? "Creating Listing..." : "Publish Accommodation"}
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

        .sh-login-alert {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--sh-warning-bg);
          color: var(--sh-warning);
          padding: 16px 20px;
          border-radius: var(--sh-radius-md);
          margin-bottom: 24px;
        }

        .sh-login-alert p {
          color: inherit;
          font-size: 0.85rem;
          margin: 0;
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
          margin-bottom: 6px;
        }

        .sh-form-subtext {
          font-size: 0.875rem;
          color: var(--sh-text-secondary);
          margin-bottom: 20px;
        }

        .sh-form-row {
          display: flex;
          gap: 16px;
        }

        .sh-form-row .sh-form-group {
          flex: 1;
        }

        /* Upload zone */
        .sh-upload-zone {
          border: 2px dashed var(--sh-border);
          border-radius: var(--sh-radius-lg);
          padding: 28px;
          text-align: center;
          background: #FAFAFA;
          transition: border-color var(--sh-transition-fast);
        }

        .sh-upload-zone:hover {
          border-color: var(--sh-primary);
        }

        .sh-drop-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .sh-drop-label span {
          font-weight: 600;
          color: var(--sh-text-primary);
        }

        .sh-drop-hint {
          font-size: 0.8rem;
          font-weight: normal !important;
          color: var(--sh-text-secondary) !important;
        }

        .sh-file-input {
          display: none;
        }

        .sh-preview-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .sh-preview-img {
          max-height: 240px;
          border-radius: var(--sh-radius-md);
          object-fit: cover;
        }

        /* Features */
        .sh-features-checklist {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .sh-feature-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #FFFFFF;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-md);
          cursor: pointer;
          transition: all var(--sh-transition-fast);
          text-align: left;
        }

        .sh-feature-checkbox:hover {
          border-color: var(--sh-border);
          background: #FAFAFA;
        }

        .sh-feature-checkbox.checked {
          border-color: var(--sh-text-primary);
          background: var(--sh-bg-hover);
        }

        .sh-check-box {
          width: 20px;
          height: 20px;
          border: 1.5px solid var(--sh-border);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sh-check-box.checked {
          background: var(--sh-primary);
          border-color: var(--sh-primary);
        }

        .sh-feature-checkbox span {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--sh-text-primary);
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
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
