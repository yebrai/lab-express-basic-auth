const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require('bcrypt')


// GET /auth/signup => render form of singup page
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

// POST /auth/signup => get data form for make a new user
router.post("/signup", async (req, res, next) => {
    const { username, email, password, passwordConfirmation } = req.body

    //1. Backend validations
    //1.1 Fields completed
    if (username === "" || email === "" || password === "" || passwordConfirmation === "") {
        res.render("auth/signup.hbs", {
            errorMessage: "Debes llenar todos los campos"
        })
        return
    }

    //1.2 password validation
     const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm
     if (passwordRegex.test(password) === false ) {
         res.render("auth/signup.hbs", {
             errorMessage: "The password must have a minimum of 6 characters, a capital letter and a number"
         })
         return; 
    }
    //1.3 confirm password again
     if (passwordConfirmation !== password) {
         res.render("auth/signup.hbs", {
             errorMessage: "the password confirmation must be same than password"
         })
         return; 
     }

     //1.4 validation of unique username
    try {
        const foundUser = await User.findOne({username: username})
        if (foundUser !== null) {
            // | si existe en la DB:
            res.render("auth/signup.hbs", {
                errorMessage:"Username in use"
            })
        }
    } catch (error) {
        next(error)
        
    }
    //1.5 validation of unique email
    try {
        const foundUser = await User.findOne({email: email})
        if (foundUser !== null) {
            // | si existe en la DB:
            res.render("auth/signup.hbs", {
                errorMessage:"Email in use"
            })
        }
        // 2. Security
        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, salt)
    
        // 3.Create user
        const newUser = {
            username: username,
            email: email,
            password: hashPassword
        }
        await User.create(newUser)
    
        res.redirect("/")

    } catch (error) {
        next(error)
        
    }
})


// GET /auth/login - render to login form
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
 })

// POST /auth/login - get data from form
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body


    //1. Backend validations
    //1.1 Fields completed
    if (email === "" || password === "") {
        res.render("auth/login.hbs", {
            errorMessage:"usuario ya creado con ese nombre"
        })
        return;
    }

    //1.2 Account exist
    try {
        const foundUser = await User.findOne({email: email})
        if (foundUser === null) {
            res.render("auth/login.hbs", {
                errorMessage:"Account or password incorrect"
            })
            return;
        }
        // 2. Verifing password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, foundUser.password)
        console.log("isPasswordValid", isPasswordValid)
        if (isPasswordValid === false) {
            res.render("auth/login.hbs", {
                errorMessage:"incorrect email address or password"
            })
            return;
        }
        // 3. implement session sistem

        // express-sesion crea la sesion y envia el cokie (copia de la sesion)
        //connect-mongo
        
        //User is active
        req.session.userOnline = foundUser;

        // Created correctly
        req.session.save(() => {
            // 4. redirects to private page
            res.redirect("/profile")

        })

    }
    catch (error) {
        next(error)
    }

})

router.get("/logout", (req, res, next) => {
    req.session.destroy(() => {
         res.redirect("/")
     })
 })

module.exports = router;