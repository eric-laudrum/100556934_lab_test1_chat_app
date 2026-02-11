require('dotenv').config();
const express = require('express')
const path = require('path');
const socketio = require('socket.io')
const mongoose = require('mongoose');

const User = require('./models/Users');
const GroupMessage = require('./models/GroupMessage');

const app = express();
const SERVER_PORT = process.env.PORT || 3000


const Mongo_Uri = process.env.MONGO_URI;

mongoose.connect(Mongo_Uri)
    .then(() => console.log("Database connection successful"))
    .catch( err => console.error('Error: Database connection failed: ', err));

app.use( express.json() );
app.use( express.static( path.join(__dirname, 'views')));

// Routes
app.get('/', (req, res) => {
    res.sendFile( path.join(__dirname, 'views/signup.html')) // make separate home page?
})
app.get('/signup', (req, res) => {
    res.sendFile( path.join(__dirname, 'views/signup.html'))
});
app.get('/login', (req, res) => {
    res.sendFile( path.join(__dirname, 'views/login.html'))
});
app.get('/chat', (req, res) => {
    res.sendFile( path.join(__dirname, 'views/chat.html'))
});


// Sign up
app.post('/api/signup', async( req, res ) =>{
    try{
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "Account created successfully"})
    } catch(err){
        res.status(400).json({ error: "Error: Account creation failed: ", err });
    }
})
// Log in
app.post('/api/login', async( req, res ) =>{
    const { username, password } = req.body;
    try{
        const user = await User.findOne({ username, password });
        if( user ){
            res.status( 200 ).json({
                status: true,
                username: user.username,
                firstname: user.firstname
            });
        } else{
            res.status(401).json({ status: false, })
        }
    } catch( err ){
        res.status(500).json({ error: err.message });
    }
});
//start listening to server on PORT
const appServer = app.listen( SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${ SERVER_PORT }/`)
})

// Associate appServer with socket server
const ioServer = socketio( appServer )

// when event occurs, callback is executed
ioServer.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join chat group
    socket.on('join-group', (room) => {
        socket.join(room);

        console.log(`User ${socket.id} joined room: ${room}`);
        ioServer.to(room).emit('group-ack', `User ${socket.id} joined ${room}`);
    });

    // Leave chat group
    socket.on('leave-group', (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left ${room}`);
    });

    // Chat message

    socket.on('chat-from-client', async (data) => {
        console.log(`ON SERVER - CHAT FROM USER - RECEIVED - with data: ${data}`);

        const { from_user, room, message } = data;

        const newMessage = new GroupMessage({
            from_user,
            room,
            message,
            date_sent: new Date().toLocaleString()
        });

        try {
            await newMessage.save(); // Saves to Atlas
            ioServer.to(room).emit('chat-ack', data); // Broadcast to room
        } catch (err) {
            console.error("Save error:", err);
        }
    });


    socket.on("typing", (data) =>{
        socket.broadcast.to(data.room).emit("display-typing", data);
    })
    


    // User disconnects
    socket.on("disconnect", () =>{
        // perform necessary wind up operations
        console.log(`User ${socket.id} disconnected`);
    })
})
