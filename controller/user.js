const User = require("../models/user");

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{}|;:,.<>])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{}|;:,.<>]{8,}$/;

module.exports.rendersignUpForm = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.signUpUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        username = (username || "").trim();
        email = (email || "").trim();

        if (!username || !email || !password) {
            req.flash("error", "All fields are required.");
            return res.redirect("/signup");
        }

        // Email Regular Expression Check
        if (!EMAIL_REGEX.test(email)) {
            req.flash("error", "Please enter a valid email address (e.g. name@example.com).");
            return res.redirect("/signup");
        }

        // Strong Password Regular Expression Check
        if (!STRONG_PASSWORD_REGEX.test(password)) {
            req.flash("error", "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return res.redirect("/signup");
        }

        const escapedUsername = username.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        const escapedEmail = email.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

        let existingUser = await User.findOne({
            $or: [
                { username: new RegExp("^" + escapedUsername + "$", "i") },
                { email: new RegExp("^" + escapedEmail + "$", "i") }
            ]
        });

        if (existingUser) {
            req.login(existingUser, function (err) {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome back to StayHub");
                return res.redirect("/listings");
            });
        } else {
            let newUser = new User({ email, username });
            let registeruser = await User.register(newUser, password);
            req.login(registeruser, function (err) {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to StayHub");
                return res.redirect("/listings");
            });
        }
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

module.exports.renderloginForm = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to StayHub");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logout Successfully");
        res.redirect("/listings");
    });
};
