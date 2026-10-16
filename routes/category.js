const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

const listings = require("../models/listing");




router.get('/category/:category', wrapAsync(async(req, res) => {
    const category = req.params.category;
    const alisting = await listings.find({ category });
    res.render("listings/category.ejs", { category, alisting });
}));


module.exports = router;
