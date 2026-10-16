// Centralized StayHub API Service with session credentials support

const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    credentials: "include", // Essential for Express session cookies
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  };

  // If body is plain object, JSON stringify and set Content-Type
  if (config.body && !(config.body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data && data.message ? data.message : `HTTP error ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Public config
  getConfig: () => request("/config"),

  // Auth
  getCurrentUser: () => request("/auth/current-user"),
  login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
  signup: (userData) => request("/auth/signup", { method: "POST", body: userData }),
  logout: () => request("/auth/logout", { method: "POST" }),

  // Listings
  getListings: ({ category, search } = {}) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (search && search.trim()) params.append("search", search.trim());
    const query = params.toString() ? `?${params.toString()}` : "";
    return request(`/listings${query}`);
  },
  getListingById: (id) => request(`/listings/${id}`),
  createListing: (formData) => request("/listings", { method: "POST", body: formData }),
  updateListing: (id, formData) => request(`/listings/${id}`, { method: "PUT", body: formData }),
  deleteListing: (id) => request(`/listings/${id}`, { method: "DELETE" }),

  // Reviews
  addReview: (listingId, reviewData) =>
    request(`/listings/${listingId}/reviews`, {
      method: "POST",
      body: { review: reviewData },
    }),
  deleteReview: (listingId, reviewId) =>
    request(`/listings/${listingId}/reviews/${reviewId}`, { method: "DELETE" }),

  // Bookings & Profile
  createBooking: (listingId, bookingData) =>
    request(`/bookings/${listingId}`, {
      method: "POST",
      body: bookingData,
    }),
  cancelBooking: (bookingId) => request(`/bookings/${bookingId}`, { method: "DELETE" }),
  getProfile: () => request("/profile"),
};
