// Before login routes handler -----------------------------------------------------------
// Require stuff
const express = require("express")
const passport = require("passport")
const User = require("../models/users")

const router = express.Router()

// -----------------------------------------------------------
// register route
router.get("/register", (req, res) => {
    res.render("register.ejs", {
        tabTitle: "Registration"
    })
})

router.post("/register", async (req,res) => {
    const { username, password } = req.body
    try {
        const user = await new User({username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, () => {
            req.flash("success", "Welcome to RobDido Music Festival Collection!")
            res.redirect("/events") // prefix routes cant access here, be explicit
        })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/events/register")
    }
})

// -----------------------------------------------------------
// login route
router.get("/login", (req,res) => {
    res.render("login.ejs", {
        tabTitle: "Login"
    }) 
})

// this is what dido taught...
// router.post("/login", passport.authenticate("local", {
//     failureRedirect: "/events/login",
//     successRedirect: "/events",
//     failureFlash: true
// }))

// but if I want to flash success msg after login
router.post("/login", 
    passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/events/login"
}), (req,res) => {
    req.flash("success", "Welcome Back!")
    res.redirect("/events")
})

// -----------------------------------------------------------
// logout route
router.post("/logout", (req,res) => {
    req.logout(() => {
        req.flash("success", "Sayonara!")
        res.redirect("/homeBeforeLogin")
    })
})

// -----------------------------------------------------------
// export
module.exports = router