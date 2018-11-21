const express = require("express");
const app = express();
const passport = require("passport");
const mongoose = require("mongoose")
const FacebookStrategy = require("passport-facebook").Strategy
const FacebookClientID = require("../config").FacebookClientID
const FacebookClientSecret = require("../config").FacebookClientSecret
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
    passport.use(new FacebookStrategy({
        clientID: FacebookClientID,
        clientSecret: FacebookClientSecret,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'],
        enableProof: true
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

    app.get("/auth/facebook", passport.authenticate("facebook"))
    app.get("/auth/facebook/callback", passport.authenticate("facebook", {
        successRedirect: '/entry',
        failureRedirect: "/503",
        failureFlash: 'Invalid social authentication',
        successFlash: 'Welcome'
    }))


}