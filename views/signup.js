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

