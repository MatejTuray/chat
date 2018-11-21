const mongoose = require("mongoose")
const Schema = mongoose.Schema

const RoomSchema = new Schema({

    name: {
        type: String
    },
    creator: {
        type: String
    },
    users: [
        {
            
        }
    ],
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
            }
        }

    ]

})

mongoose.model("rooms", RoomSchema);