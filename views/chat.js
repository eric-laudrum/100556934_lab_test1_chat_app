const socket = io();
const username = localStorage.getItem('username');
let currentRoom = "";

if (!username) {
    window.location.href = 'login.html';
}

document.getElementById('display-username').textContent = username;

    
// Join chat room
function joinRoom(){
    const room = document.getElementById('select-room').value;

    // Current room
    if( currentRoom === room){
        return;
    };

    if( currentRoom ){
        socket.emit('leave-group', currentRoom);
    }

    currentRoom = room;
    socket.emit('join-group', room);

    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML += `<p>${username} joined ${room}</p>`;
}

// Leave chat room
function leaveRoom() {
    if (currentRoom) {
        socket.emit('leave-group', currentRoom);
        document.getElementById('chat-window').innerHTML += `<p>${username} left ${currentRoom}</p>`;
        currentRoom = ""; // reset
    }
}

// Send message
function sendMessage(){
    const input = document.getElementById('chat-input');
    const message = input.value;

    if( message.trim() && currentRoom ){
        const data={
            from_user: username,
            room: currentRoom,
            message: message,
        }

        socket.emit('chat-from-client', data);
        input.value = "";
    } else{
        console.log('Select a room to send a message...')
    }
}

// Receive Message 
socket.on('chat-ack', (data) => {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML += `<p>${data.from_user}: ${data.message}</p>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Logout
function logout(){
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

socket.on('group-ack', (message) => {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML += `<p>${message}</p>`;
});