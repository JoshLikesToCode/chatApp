const chatForm = document.getElementById('chat-form'); // for manipulating chat DOM
const chatMessages = document.querySelector('.chat-messages'); // allow chat scroll to move dynamically
const roomName = document.getElementById('room-name'); // for current room
const userList = document.getElementById('users'); // for list of users in current room

// get username and room by parsing query strings in url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// for testing purposes
// console.log(username, room);

const socket = io();

// Joined chatroom
socket.emit('joinRoom', {username, room});

// get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// will grab socket.emit() msgs, for instance the one in io.on() in server.js file
// will allow users to send msgs
// will post msg when user logs in/out of chat
socket.on('message', message => {
    console.log(message);
    outPutMessage(message); // msg on server

    // dymically scroll with msgs
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// event listener for chat-form
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent submitting to a file
    // grabs chat-form msg by id
    const msg = e.target.elements.msg.value;
    // emit msg to server
    socket.emit('chatMessage', msg);
    // clear chat input after we send msg
    e.target.elements.msg.value = '';
    // focus on chat input after we send msg
    e.target.elements.msg.focus();
});


// Output msg to DOM
function outPutMessage(message)
{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                     <p class="text">
                        ${message.text}
                      </p>`;
    // whenever a new msg is made, the above div is appended to .chat-messages
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom
function outputRoomName(room) 
{
    roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}