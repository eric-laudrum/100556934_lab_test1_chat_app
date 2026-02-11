const clientIO = io()

const logEvent = (message) => {
    const logsDiv = document.getElementById('event-log');
    if (!logsDiv) return;
    const logEntry = document.createElement('p');
    logEntry.style.margin = "2px 0";
    logEntry.textContent = `> ${new Date().toLocaleTimeString()}: ${message}`;
    logsDiv.appendChild(logEntry);
    logsDiv.scrollTop = logsDiv.scrollHeight;
};

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    logEvent("Logging in...");

    const loginData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( loginData )
        });

        const result = await response.json();

        if (response.ok && result.status ) {
            logEvent("SUCCESS: Account created in Atlas.");
            localStorage.setItem('username', result.username);

            alert(`${result.firstname} signed in successfully`);
            window.location.href = 'chat.html';

        } else {
            logEvent(`ERROR: ${result.error || 'Login failed'}`);
            alert(result.error || "Login failed");
        }
    } catch (err) {
        logEvent(`CONNECTION ERROR: ${err.message}`);
        console.error("Login error:", err);
    }
});

