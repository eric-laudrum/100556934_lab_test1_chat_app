const clientIO = io()

const logsDiv = document.getElementById('event-log');

const logEvent = (message) => {
    const logsDiv = document.getElementById('event-log');
    if (!logsDiv) return;
    const logEntry = document.createElement('p');
    logEntry.style.margin = "2px 0";
    logEntry.textContent = `> ${new Date().toLocaleTimeString()}: ${message}`;
    logsDiv.appendChild(logEntry);
    logsDiv.scrollTop = logsDiv.scrollHeight;
};

document.getElementById('sign-up-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    logEvent("Signing up...");

    const userData = {
        username: document.getElementById('username').value,
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            logEvent("SUCCESS: Account created in Atlas.");
            alert("Account created successfully!");
            window.location.href = 'login.html';
        } else {
            logEvent(`ERROR: ${result.error || 'Signup failed'}`);
            alert(result.error || "Signup failed");
        }
    } catch (err) {
        logEvent(`CONNECTION ERROR: ${err.message}`);
        console.error("Signup error:", err);
    }
});

const sendPing = () => {
    logEvent(`\nPing button clicked`);

    const message = "Hello from client"
    // send ping to server
    // emit() sends the event
    clientIO.emit('ping', message)

    logEvent(`\nON CLIENT - PING - SENT - with message ${message}`)

};

clientIO.on('pick-ack', (response) => {
    logEvent(`\nON CLIENT - PING-ACK - RECEIVED - with response ${response}`)
})



const sendChatMessage = () => {
    logEvent('\nChat button clicked');

    const message = document.getElementById('message-input').value
    
    if (message.trim()){
        // send message from client
        clientIO.emit('chat-from-client', message)

        logEvent(`\nON CLIENT - CHAT - SENT - with message : ${message}`)
    }else{
        logEvent(`\nON CLIENT - CHAT - ERROR - Message is empty. Can't send.`)
    }
};

clientIO.on('chat-ack', (response) => {
    logEvent(`\nON CLIENT - CHAT ACK - RECEIVED - Server acknowledged chat message with response ${response}`)
})

const sendFeedback = () =>{
    logEvent('\nSend feedback button clicked');
    const userInput = document.getElementById('feedback-message').value;

    const feedback = {
        date:  new Date(),
        user: clientIO.id,
        message: userInput
    }

    // end feedback from client
    clientIO.emit('feedback', feedback)

    logEvent(`\nON CLIENT - FEEDBACK - SENT : ${JSON.stringify(feedback)}`);
};
clientIO.on('chat-ack', () =>{
    logEvent(`\nON CLIENT - FEEDBACK ACK - RECEIVED - Server acknowledged feedback: ${JSON.stringify(response)}`)
})


const joinGroup = () => {
    logEvent('\nJoin group button clicked');
    
    // send group join request
    clientIO.emit('join-group', 'GRP-1')

    logEvent(`\nON CLIENT - JOIN-GROUP - SENT - request sent.`)
};

const leaveGroup = () => {
    logEvent('\Leave group button clicked');

    // send group leave request
    clientIO.emit('leave-group', 'GRP-1')

    logEvent(`\nON CLIENT - LEAVE-GROUP - SENT - request sent.`)
};


clientIO.on('group-ack', (response)=>{
    logEvent(`\nON CLIENT - GROUP ACK - RECEIVED - Server acknowledged group request: ${response}`)
})

const disconnectServer = () => {
    logEvent('\nDisconnect server button clicked');

    // send disconnect  request
    clientIO.emit("disconnect")
    logEvent(`\nON CLIENT - DISCONNECT - SENT - request sent.`)
};