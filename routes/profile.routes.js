const router = require("express").Router();
const User = require("../models/User.model");
const { isLoggedIn } = require("../middlewares/auth.middlewares.js");

// GET /profile => renderiza el profile-hbs
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const UserDetails = await User.findById(req.session.userOnline._id);
    res.render("profile/my-profile.hbs", { UserDetails });
    console.log(req.session.userOnline);
  } catch (error) {
    next(error);
  }
});

// GET /profile/main => renderiza el main.hbs
router.get("/main", (req, res, next) => {
  res.render("profile/main.hbs");
});

// GET /profile/main => renderiza el private.hbs
router.get("/private", (req, res, next) => {
  res.render("profile/private.hbs");
});

module.exports = router;
