const express = require("express");
const app = express();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy
const GoogleClientID = require("../config").GoogleClientID
const GoogleClientSecret = require("../config").GoogleClientSecret
const mongoose = require("mongoose")
const User = mongoose.model("users")
const axios = require("axios")
//
//
module.exports = (app) => {
    let usr
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
    passport.use(new GoogleStrategy({
        clientID: GoogleClientID,
        clientSecret: GoogleClientSecret,
        callbackURL: "/auth/google/callback",

    }, (accessToken, refreshToken, profile, done) => {

        User.findOne({
            appid: profile.id
        }).then((user) => {
            if (user) {
                usr = user  
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
                    usr = user                  
                    done(null, user)
                })

            }
        })


    }))

    app.get("/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    }))
    app.get("/auth/google/callback", passport.authenticate("google", {
        successRedirect: '/entry', 
        failureRedirect: "/503",
        failureFlash: 'Invalid social authentication',
        successFlash: 'Welcome'
    }
    ))
    app.get("/api/logout", (req, res) => {
        req.logout();
        res.send(req.user)
    })
    app.get("/api/current_user", (req, res) => {          
        if(req.user){            
            res.status(200).send(req.user)  
        
        }
        
    })
}
