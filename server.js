const env = require("./testENV").env;
console.log("env:", env)
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet")
const http = require("http")
const socketIO = require("socket.io")
const cookieSession = require("cookie-session");
const passport = require("passport")
const key = require("./config").cookieKey
const mongoose = require("mongoose")
const flash = require("connect-flash")
const _ = require("lodash")
const cors = require('cors');
const axios = require("axios")

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
require("./models/User")
require("./models/Room")
const User = mongoose.model("users")
const server = http.createServer(app)
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [key]
}))
app.use(flash())
app.enable("trust proxy");
app.use(passport.initialize())
app.use(passport.session())
require("./oauth/oauth-google")(app)
require("./oauth/oauth-facebook")(app)
require("./oauth/oauth-github")(app)

app.use(cors());
app.options('*', cors());

const io = socketIO(server);

const generateMessage = (from, text, img) => {
    return {
        from,
        text,
        img,
        createdAt: new Date().getTime()
    };
};
let users = []
let rooms = []
let helper = []
let uniqueUsers
let usersWithNames
io.on("connection", (socket) => {
    setTimeout(() => socket.disconnect(true), 60000*15);
    users.push({ id: socket.id })
    socket.emit("fetch_id", socket.id)

    console.log("User has connected ", socket.id)

    socket.on("set_name", (data) => {
        socket.name = data.name
        socket.img = data.img
        console.log(socket.name, socket.img, data)
        console.log("New user: " + socket.id + ": " + socket.name, socket.img)
        socket.emit("fetch_user", socket.name)
        users.find((user) => {
            if (user.id === socket.id) {
                user.name = socket.name
                user.img = socket.img
            }
        })
        for (let user of users) {
            users.find((user) => {
                if (user.name) {
                    helper.push(user)
                }
            })
        }

        uniqueUsers = new Set(helper)
        usersWithNames = Array.from(uniqueUsers)
        usersWithNames = _.uniq(usersWithNames)
        io.emit("get_users", usersWithNames)
        console.log(usersWithNames)
    })



    socket.on("create_room", (room) => {

        socket.join(room)
        console.log(room)
        rooms.push(room)
        



    })

    socket.on("calling", (data) => {
        console.log(data.name, data.callerID)
        io.to(data.callerID).emit("call", data.name)

    })
    socket.on("recieving", (data) => {
        console.log(data.rec)
        io.emit("recieving")
    })

    socket.on("join_room", (room) => {
        console.log(room)
        console.log(socket.rooms);

        socket.join(room)


    })
    socket.on("get_rooms", () => {
        uniqueUsers = new Set(helper)
        console.log(uniqueUsers)
        usersWithNames = Array.from(uniqueUsers)
        console.log(usersWithNames)
        socket.emit("get_rooms", {
            rooms: io.sockets.adapter.rooms,
            userRooms: socket.rooms,
            roomsRooms: rooms,
            users: usersWithNames
        })
    })


    socket.on("clear_rooms", () => {

        io.emit("clear_rooms", {
            rooms: io.sockets.adapter.rooms,
            userRooms: socket.rooms,
            roomsRooms: rooms,
        })
        socket.leaveAll()
    })
    socket.on("private_message", (socket, message, userId, name) => {
        if(socket){
            io.to(socket).emit("private_message_recieved", generateMessage(message.from, message.text, message.img))
        }        
        let msg = generateMessage(message.from, message.text, message.img)
        console.log("updating")
        axios.patch(`https://react-chat01.herokuapp.com/api/users/${userId}/friends/${name}`, {
            from: msg.from,
            text: msg.text,
            img: msg.img,
            createdAt: msg.createdAt
        }).then((res) => console.log("First update success"))
        console.log(name)
        User.findOne({name:name}, null, null, (err, user) => {
        if(user){
        {console.log(user);
            axios.patch(`https://react-chat01.herokuapp.com/api/users/${user._id}/friends/${msg.from}`, {
                from: msg.from,
                text: msg.text,
                img: msg.img,
                createdAt: msg.createdAt
            }).then((res) => console.log(res))
        }
        
        }
        else{
            res.status(404).send({response: "Error, user not found"})
        }
         }
        )
       
    })

    socket.on("private_message_sent", (socket, message) => {
        io.to(socket).emit("private_message_sent", generateMessage(message.from, message.text, message.img))
    })
    

    socket.on("room_users", (room) => {
        console.log(io.sockets.clients(room).eio)
    })
    socket.on("disconnect", (sckt) => {        
        console.log("User disconnected")
        console.log(sckt.id, sckt.name)
        uniqueUsers = new Set(helper)
        usersWithNames = Array.from(uniqueUsers)
        usersWithNames = usersWithNames.filter((user) => sckt.name !== user.name)
        usersWithNames = _.uniq(usersWithNames)
        io.emit("user_disconnect", usersWithNames)       
        console.log(usersWithNames)
        socket.disconnect(true)
    })
    socket.on("disconnect_room", (room) => {
        socket.leave(room, (err) => {
            socket.emit("disconnect_room", {
                message: "Rooms:" + socket.adapter.rooms
            })
            console.log(err)
        })
       
    })
    socket.on("room_message", (room, message, id) => {
        
        io.sockets.in(room).emit("newMessage", generateMessage(message.from, message.text, message.img))
        let msg = generateMessage(message.from, message.text, message.img)
        console.log(msg) 
        console.log(id)       
        axios.patch(`https://react-chat01.herokuapp.com/api/channels/${id}`, {
            from: msg.from,
            text: msg.text,
            img: msg.img,
            createdAt: msg.createdAt
        }).then(res => console.log(res))
    })
    socket.on("get_room_id", () => {
        console.log(socket.adapter.rooms)
    })
    socket.on("add_friend", (data) => {
        io.to(data.id).emit("friend_request", {name:data.sender, img:data.senderImg})
    })
    socket.on("remove_friend", (data) => {
        io.to(data.id).emit("deleted_from_friends", data.sender )
    })
    socket.on("user_typing", (name, room) => {
        console.log(name, room)
        socket.to(room).emit("typing", name)
    })
    socket.on("user_stop_typing", (name,room) =>{
        console.log(name + " has stopped typing")        
        socket.to(room).emit("stopTyping", name)
        
    })
    socket.on("channel_created", () => {
        io.emit("channel_created")
    })
    socket.on("accepted", (data) => {
        console.log(data)
        io.to(data.id).emit("accepted", (data.sender, data.senderImg))
    })
})




require("./routes")(app)

    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('client/build'));
  
    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  
server.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
})

module.exports = { app }
