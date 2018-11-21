const mongoose = require("mongoose")
const Schema = mongoose.Schema
let uniqueValidator = require('mongoose-unique-validator');
const userSchema = new Schema({

    appid: {
        type: String
    },
    name: {
        type: String
    },
    img: {
        type: String
    },
    pending: [
        
    {     name: {
                type: String,          

                 },
            img: {
                 type: String,
                    },



    },
],
    friends: [
        {
        name: {
                type: String,          

                 },
        img: {
            type: String,
        },
        messages: [
            {
    
                from: {
                    type: String
                },
                img: {
                    type: String,
                },
                createdAt: {
                    type: Number
                },
                text: {
                    type: String
                },
            },
    
        ]
    }
    ]
})


mongoose.model("users", userSchema);