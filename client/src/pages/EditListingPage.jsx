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
  const [title, setTitle] = useState(listing.title || "");
  const [description, setDescription] = useState(listing.description || "");
  const [price, setPrice] = useState(listing.price || "");
  const [location, setLocation] = useState(listing.location || "");
  const [country, setCountry] = useState(listing.country || "India");
  const [category, setCategory] = useState(listing.category || "Trending");
  const [selectedFeatures, setSelectedFeatures] = useState(listing.features || []);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const originalImageUrl = listing.image ? listing.image.url : "";

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
    </div>
  );
}
