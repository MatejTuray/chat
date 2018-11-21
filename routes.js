const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")
const User = mongoose.model("users")
const Room = mongoose.model("rooms")

module.exports = (app) => {
    //ADD FRIENDS
    app.patch("/api/users/:id/friends/add", (req, res) => {
        console.log(req.body)
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else {
            User.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    friends: {
                        name: req.body.name,
                        img: req.body.img,
                        messages: [

                        ]
                    }
                }

            }).then((user) => {
                if (user) {

                    res.status(200).send({ response: "Friend added" })
                }
                else {
                    res.send({ response: "Something bad happened" })
                }
            })

        }
    })
    //GET ALL FRIENDS
    app.get("/api/users/:id/friends", (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else {
            User.findOne({ _id: req.params.id }).then((user) => {
                return res.status(200).send(user)
            })
        }
    })
    //DELETE FRIEND
    app.patch("/api/users/:id/friends/delete", (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else {
            User.findOneAndUpdate({ _id: req.params.id }, {
                $pull: {
                    friends: {
                        name: req.body.name
                    }
                }

            }).then((user) => {
                if (user) {

                    res.status(200).send({ response: "Friend removed" })
                }
                else {
                    res.status(500).send({ response: "Something bad happened" })
                }
            })

        }
    })
    //PRIVATE MESSAGE CACHING
    app.patch("/api/users/:id/friends/:name", (req,res) => {
        let id = req.params.id
        let name = req.params.name        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else {
            User.findOneAndUpdate({ _id: req.params.id, friends: 
                {
                    $elemMatch: {name: name} }         
                }, {$push:{"friends.$.messages":{
                    from: req.body.from,
                    text: req.body.text,
                    img: req.body.img,
                    createdAt: req.body.createdAt
                }}}                 
                )
                .then((user) => {
                    if (user) {

                        res.status(200).send(user)
                    }
                    else {
                        res.status(500).send({ response: "Something bad happened" })
                    }
                })

        }
    })
    //GET SPECIFIC MESSAGES FOR FRIEND CONV
    app.get("/api/users/:id/friends/:name", (req,res) => {
        let id = req.params.id
        let name = req.params.name        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else{
            User.findOne({ _id: req.params.id, friends: 
                {
                    $elemMatch: {name: name} }    } ).then((user) => {
                        if(user){
                            res.status(200).send(user)
                        }
                        else{
                            res.status(404)
                        }
                    })
        }
    })
    

    //CHANNEL CREATE
    app.post("/api/channels", (req, res) => {
        let newChannel = new Room({
            name: req.body.name,
            creator: req.body.creator
        })
        newChannel.save().then((channel) => res.status(200).send(channel)).catch((err) => res.status(400).send(err))
    })
    //GET ALL CHANNELS
    app.get("/api/channels", (req, res) => {
        Room.find().then((rooms) => res.status(200).send(rooms)).catch((err) => res.status(400).send(err))
    })
    //GET ALL USERS
    app.get("/api/users/", (req,res) => {
        User.find().then((users) => res.status(200).send(users)).catch((err) => res.status(400).send(err))
    })

    //MESSAGE CACHING
    app.patch("/api/channels/:id", (req, res) => {
        let id = req.params.id
        console.log(req.body)
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else {
            Room.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    messages: {

                        from: req.body.from,
                        text: req.body.text,
                        img: req.body.img,
                        createdAt: req.body.createdAt
                    }


                }
            })
                .then((room) => {
                    if (room) {

                        res.status(200).send({ response: "Message saved" })
                    }
                    else {
                        res.status(500).send({ response: "Something bad happened" })
                    }
                })

        }
    })
    //GET USER BY NAME AND IMGSTRING  > axios cannot handle data in get req body

    app.post("/api/users/:name", (req,res) => {        
        let name = req.params.name
        console.log(req.body, name)       
    
            User.findOne({name: name, img: req.body.img}).then((user) => {
                if(user){
                    res.status(200).send(user)
                }
                else{
                    res.status(404).send({response: "User not found"})
                }

            })

    
})
    //PENDING FRIEND REQUESTS

    app.patch("/api/users/:id/pending", (req,res) =>{

        console.log(req.body)
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else {
            User.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    pending: {
                        name: req.body.name,
                        img: req.body.img,                       
                    }
                }

            }).then((user) => {
                if (user) {

                    res.status(200).send({ response: "Pending friend request" })
                }
                else {
                    res.send({ response: "Something bad happened" })
                }
            })

        }

    })

    //RESOLVE PENDING FRIEND REQUEST

    app.delete("/api/users/:id/pending", (req,res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else {
            User.findOneAndUpdate({ _id: req.params.id }, {
                $pull: {
                    pending: {
                        name: req.body.name
                    }
                }

            }).then((user) => {
                if (user) {

                    res.status(200).send({ response: "Friend removed" })
                }
                else {
                    res.status(500).send({ response: "Something bad happened" })
                }
            })

        }
    })


    //GET MESSAGES IN CHANNEL 
    app.get("/api/channels/:id", (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        else {
            Room.findOne({ _id: req.params.id })
                .then((room) => {
                    if (room) {

                        res.status(200).send(room)
                    }
                    else {
                        res.status(500).send({ response: "Something bad happened" })
                    }
                })
        }
    })
   

}