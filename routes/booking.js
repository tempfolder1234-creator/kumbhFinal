const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware"); // Ensure user is logged in
const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Handle Booking Request
router.post("/:listingId", isLoggedIn, async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const listing = await Listing.findById(req.params.listingId);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const booking = new Booking({
            user: req.user._id,
            listing: listing._id,
            startDate,
            endDate
        });

        await booking.save();
        req.flash("success", "Booking confirmed!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Booking failed");
        res.redirect(req.get('Referrer') || "/listings");
    }
});


// ✅ Cancel Booking Route
router.delete("/:id", isLoggedIn, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        req.flash("success", "Booking cancelled successfully.");
        res.redirect("/profile");
    } catch (err) {
        console.error("Error deleting booking:", err);
        req.flash("error", "Failed to cancel booking.");
        res.redirect("/profile");
    }
});


module.exports = router;
