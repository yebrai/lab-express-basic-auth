const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// acces routes
const authRoutes = require ("./auth.routes.js")
router.use("/auth", authRoutes)

// same than up but shorted
router.use("/profile", require ("./profile.routes"))

module.exports = router;