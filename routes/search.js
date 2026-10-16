const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

const listings = require("../models/listing");



const handleSearch = wrapAsync(async (req, res) => {
    const nameQuery = (req.body.search || req.query.search || "").trim();
    if (!nameQuery) {
        const results = await listings.find({});
        return res.render("listings/search.ejs", { results, searchQuery: "" });
    }
    const escaped = nameQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const searchRegex = new RegExp(escaped, "i");
    const results = await listings.find({
        $or: [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
            { features: searchRegex },
        ]
    });
    res.render("listings/search.ejs", { results, searchQuery: nameQuery });
});

router.route("/")
    .get(handleSearch)
    .post(handleSearch);




module.exports = router;
