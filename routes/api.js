const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;

// API Auth Guard
const requireApiAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  next();
};

// Public config (e.g. Mapbox public token)
router.get("/config", (req, res) => {
  res.json({
    success: true,
    mapToken: process.env.MAP_TOKEN || "",
  });
});

// ==================== AUTH ROUTES ====================

// Check current session
router.get("/auth/current-user", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    return res.json({
      success: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  }
  res.json({ success: true, user: null });
});

// Login
router.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: (info && info.message) || "Invalid username or password",
      });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json({
        success: true,
        message: "Logged in successfully",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// Signup
router.post("/auth/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [
        { username: new RegExp("^" + username + "$", "i") },
        { email: new RegExp("^" + email + "$", "i") },
      ],
    });

    if (existingUser) {
      req.login(existingUser, (err) => {
        if (err) return next(err);
        return res.json({
          success: true,
          message: "Welcome back to StayHub",
          user: {
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
          },
        });
      });
    } else {
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        return res.json({
          success: true,
          message: "Account created successfully",
          user: {
            _id: registeredUser._id,
            username: registeredUser.username,
            email: registeredUser.email,
          },
        });
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

// Logout
router.post("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// ==================== LISTINGS ROUTES ====================

// Get all listings (with optional category filter, multi-field search, and intelligent fallback)
router.get("/listings", async (req, res) => {
  try {
    const { category, search } = req.query;
    let conditions = [];

    if (category && category !== "All") {
      const escapedCat = category.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      conditions.push({ category: new RegExp(`^${escapedCat}$`, "i") });
    }

    if (search && search.trim() !== "") {
      const escaped = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");
      conditions.push({
        $or: [
          { title: searchRegex },
          { location: searchRegex },
          { country: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { features: searchRegex },
        ],
      });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};
    let allListings = await Listing.find(query).sort({ _id: -1 });

    // Fallback: If a category was specified alongside a search term and yielded 0 results,
    // search across all categories so the user finds what they searched for
    if (allListings.length === 0 && search && search.trim() !== "" && category && category !== "All") {
      const escaped = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");
      allListings = await Listing.find({
        $or: [
          { title: searchRegex },
          { location: searchRegex },
          { country: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { features: searchRegex },
        ],
      }).sort({ _id: -1 });
    }

    res.json({
      success: true,
      count: allListings.length,
      listings: allListings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single listing with populated reviews and owner
router.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username email" },
      })
      .populate("owner", "username email");

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.json({
      success: true,
      listing,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create new listing
router.post("/listings", requireApiAuth, upload.single("listing[image]"), async (req, res) => {
  try {
    const listingData = req.body.listing || {};

    let geometry = { type: "Point", coordinates: [73.7898, 19.9975] }; // Default Nashik coords fallback
    if (geocodingClient && listingData.location) {
      try {
        const geoResponse = await geocodingClient
          .forwardGeocode({
            query: `${listingData.location}, ${listingData.country || "India"}`,
            limit: 1,
          })
          .send();
        if (geoResponse.body.features && geoResponse.body.features.length > 0) {
          geometry = geoResponse.body.features[0].geometry;
        }
      } catch (geoErr) {
        console.warn("Geocoding fallback used:", geoErr.message);
      }
    }

    let image = {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
      filename: "default-listing",
    };

    if (req.file) {
      image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Parse features if string
    let features = listingData.features;
    if (typeof features === "string") {
      features = [features];
    } else if (!Array.isArray(features)) {
      features = [];
    }

    const newListing = new Listing({
      title: listingData.title,
      description: listingData.description,
      price: Number(listingData.price),
      location: listingData.location,
      country: listingData.country,
      category: listingData.category || "Trending",
      features: features,
      image: image,
      geometry: geometry,
      owner: req.user._id,
    });

    const savedListing = await newListing.save();
    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: savedListing,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update listing
router.put("/listings/:id", requireApiAuth, upload.single("listing[image]"), async (req, res) => {
  try {
    const { id } = req.params;
    const existingListing = await Listing.findById(id);

    if (!existingListing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (!existingListing.owner || !existingListing.owner.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized: You do not own this listing" });
    }

    const listingData = req.body.listing || {};
    let updateFields = {
      title: listingData.title,
      description: listingData.description,
      price: Number(listingData.price),
      location: listingData.location,
      country: listingData.country,
      category: listingData.category,
    };

    if (listingData.features) {
      let features = listingData.features;
      if (typeof features === "string") features = [features];
      updateFields.features = features;
    }

    if (req.file) {
      updateFields.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateFields, { new: true });
    res.json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete listing
router.delete("/listings/:id", requireApiAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (!listing.owner || !listing.owner.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized: You do not own this listing" });
    }

    await Listing.findByIdAndDelete(id);
    res.json({ success: true, message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== REVIEW ROUTES ====================

// Add review
router.post("/listings/:id/reviews", requireApiAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const reviewData = req.body.review || {};
    const newReview = new Review({
      rating: String(reviewData.rating || 5),
      Comment: reviewData.Comment || "",
      author: req.user._id,
      Date: new Date(),
    });

    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();

    await newReview.populate("author", "username email");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete review
router.delete("/listings/:id/reviews/:reviewId", requireApiAuth, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (!review.author || !review.author.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this review" });
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== BOOKINGS & PROFILE ====================

// Create booking
router.post("/bookings/:listingId", requireApiAuth, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const booking = new Booking({
      user: req.user._id,
      listing: listing._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await booking.save();
    await booking.populate("listing", "title image price location");

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Cancel booking
router.delete("/bookings/:id", requireApiAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!booking.user || !booking.user.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized to cancel this booking" });
    }

    await Booking.findByIdAndDelete(id);
    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Profile data
router.get("/profile", requireApiAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-hash -salt");
    const userListings = await Listing.find({ owner: req.user._id });
    const userBookings = await Booking.find({ user: req.user._id }).populate("listing");

    res.json({
      success: true,
      user,
      listings: userListings,
      bookings: userBookings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
