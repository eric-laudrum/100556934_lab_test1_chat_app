const socket = io();
const username = localStorage.getItem('username');
let currentRoom = "";

// Check Authorization
if (!username) {
    window.location.href = 'login.html';
}

const userDisplay = document.getElementById('display-username');
if (userDisplay) userDisplay.textContent = username;


document.getElementById('display-username').textContent = username;





const input = document.getElementById('chat-input');
if (input) {
    input.addEventListener('keypress', () => {
        if (currentRoom) {
            socket.emit('typing', { username, room: currentRoom });
        }
    });
}

socket.on('display-typing', (data) =>{
    const userIsTyping = document.getElementById('typing-status');
    if( userIsTyping ){
        userIsTyping.textContent = `${data.username} is typing...`;
        setTimeout(() => { userIsTyping.textContent = ''; }, 2000);
    }
})
    
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

    socket.emit('join-group', { room, username });

    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML += `<p>Joined ${room}</p>`;
}

// Leave chat room
function leaveRoom() {
    if (currentRoom) {
        socket.emit('leave-group', currentRoom);
        document.getElementById('chat-window').innerHTML += `<p>Left ${currentRoom}</p>`;
        currentRoom = ""; // reset
    }
}

// Send message
function sendMessage(){
    const input = document.getElementById('chat-input');
    const message = input.value;

    if (message.trim() && currentRoom) {
        const data = {
            from_user: username,
            room: currentRoom,
            message: message,
        };

        socket.emit('chat-from-client', data);
        input.value = "";
    } else if( !currentRoom){
        alert("You must enter a chat room to send messages.")
    }
}

// Receive Message 
socket.on('chat-ack', (data) => {
    const chatWindow = document.getElementById('chat-window');

    if (chatWindow) {
        // Create element to hold message
        const msgElement = document.createElement('p');
        msgElement.innerHTML = `
            <span id="date-sent">(${data.date_sent})</span>
            <strong>${data.from_user}:</strong> ${data.message}
        `;
        // Add to window
        chatWindow.appendChild(msgElement);
        
        // Auto-scroll to bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    } else {
        console.error("Could not find chat-window element!");
    }
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