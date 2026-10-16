const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
let { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");


router.route("/signup")
    .get(usercontroller.rendersignUpForm)
    .post(wrapAsync(usercontroller.signUpUser))



const resolveUsername = wrapAsync(async (req, res, next) => {
    if (req.body.username && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.username.trim())) {
        const userByEmail = await User.findOne({
            email: new RegExp("^" + req.body.username.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "$", "i")
        });
        if (userByEmail) {
            req.body.username = userByEmail.username;
        }
    }
    next();
});

router.route("/login")
    .get( usercontroller.renderloginForm)
    .post(
         saveRedirectUrl,
         resolveUsername,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        usercontroller.login
    );

router.get("/logout", usercontroller.logout);

// Google OAuth routes
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      req.flash("success", "Welcome to StayHub via Google!");
      res.redirect("/listings");
    }
  );


module.exports = router;
