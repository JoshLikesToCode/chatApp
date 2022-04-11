const path = require('path');
// required for server variable below
const http = require('http');
// to format our msgs to have usernames and time stamps
const formatMessage = require('./utils/messages.js');
// for chatroom users and individual rooms
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users.js');

const express = require('express');

// open bi-directional communication which allows us to send msgs/events back and forth
const socketio = require('socket.io');

const app = express();

// in order to use socket.io, we need to create a server variable
const server = http.createServer(app);
const io = socketio(server);

// Set public as static folder
app.use(express.static(path.join(__dirname, 'public')));

const chatBot = 'Admin'; // we can change this to whatever we'd like to later

// run when user connects
io.on('connection', socket => {

    // for testing purposes
    // console.log('New WebSocket Connection..');

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // emit sends a msg to just the user
        socket.emit('message', formatMessage(chatBot, 'Welcome to the ChatApp!'));

        // msg for when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${user.username} joined our chat`)); // broadcast emits to all users, except the connecting user
        
        //  for users current in chatroom
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    // listen for chatMessage
    socket.on('chatMessage', msg => {
        // get current users
        const user = getCurrentUser(socket.id);
        // emit msg to everybody in chat
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })
    
    // msg for when user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user)
        {
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username } has exited our chat`));
            // for users who leave the chatroom
            io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
        }
    });
});

const PORT = 3000 || process.env.PORT; // use port 300 or our environment port

// run server
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));