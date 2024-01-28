const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatDisplay = document.getElementById('chat-display');
const chatHistoryContainer = document.getElementById('chat-history-container');
const chatHistoryList = document.getElementById('chat-history-list');
const toggleHistoryButton = document.getElementById('toggle-history-button');
const chatHistory = {};
let chatTitle = null;

// Toggle chat history visibility
toggleHistoryButton.addEventListener('click', () => {
    chatHistoryContainer.classList.toggle('active');
    toggleHistoryButton.classList.toggle('active');
});

// Handle sending messages on button click and Enter key press
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userMessage = userInput.value;
    if (!chatTitle) {
        // Set the chat title to the first user input
        chatTitle = userMessage;
        addToChatHistory(chatTitle);
    }
    displayMessage('You', userMessage, 'user-message');
    sendToBackend(userMessage);
    userInput.value = '';
}

function displayMessage(sender, message, messageClass) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${messageClass}`;
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatDisplay.appendChild(messageElement);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function addToChatHistory(title) {
    // Add the chat history title to the chat history container
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    chatHistoryList.appendChild(titleElement);
}

async function sendToBackend(message) {
    try {
        const response = await fetch('http://localhost:5501/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_message: message }),
        });

        if (!response.ok) {
            console.error('Failed to send request to backend');
            return;
        }

        const data = await response.json();
        displayMessage('Ishita', data.chatbot_response, 'chatbot-message');

        // Store the chat message in the chat history object
        chatHistory[chatTitle] = chatHistory[chatTitle] || [];
        chatHistory[chatTitle].push({ sender: 'You', content: message, messageClass: 'user-message' });
        chatHistory[chatTitle].push({ sender: 'Chatbot', content: data.chatbot_response, messageClass: 'chatbot-message' });
    } catch (error) {
        console.error('Error sending request:', error);
    }
}
