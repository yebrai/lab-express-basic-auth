const isLoggedIn = (req, res, next) => {
    if (req.session.userOnline === undefined) {
        res.redirect("/auth/login")
    } else {
        next()
    }
}


module.exports = {
    isLoggedIn
}