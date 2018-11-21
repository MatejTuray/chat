const express = require("express");
const app = express();
const passport = require("passport");
const mongoose = require("mongoose")
const GitHubStrategy = require("passport-github2").Strategy
const GitHubClientID = require("../config").GitHubClientID
const GitHubClientSecret = require("../config").GitHubClientSecret
const User = mongoose.model("users")

module.exports = (app) => {
    passport.serializeUser(function (user, done) {

        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {

        User.findById(id).then((user) => {
            if (user) {
                done(null, user)
            }
            else {
                console.log("user not found")
                done(null, user)
            }
        })
    });
    passport.use(new GitHubStrategy({
        clientID: GitHubClientID,
        clientSecret: GitHubClientSecret,
        callbackURL: "https://react-chat01.herokuapp.com/auth/github/callback",
    }, (accessToken, refreshToken, profile, done) => {

        User.findOne({
            appid: profile.id
        }).then((user) => {
            if (user) {
                done(null, user)
            }
            else {
                let name
                if (profile.displayName === null) {
                    name = profile.username
                }
                else {
                    name = profile.displayName
                }
                new User({
                    appid: profile.id,
                    name: name,
                    img: profile.photos[0].value
                }).save().then((user) => {
                    done(null, user)
                })

            }
        })


    }))

    app.get("/auth/github", passport.authenticate("github", { scope: ['read:user'] }))
    app.get("/auth/github/callback", passport.authenticate("github", {
        successRedirect: '/entry',
        failureRedirect: "/503",
        failureFlash: 'Invalid social authentication',
        successFlash: 'Welcome'
    }))


}