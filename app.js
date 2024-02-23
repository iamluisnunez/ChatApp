// Connect to the WebSocket server
const socket = io();
const currentDate = new Date();

// JavaScript code to toggle night mode
const toggleNightModeButton = document.getElementById("toggle-night-mode");
const body = document.body;

document.getElementById("toggle-night-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
});

// Handle form submission
function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  if (message.trim() !== "") {
    // Emit the message to the server
    socket.emit("chat message", message);

    // Clear the input field
    messageInput.value = "";
  }
}
function clearMessages() {
  const messagesList = document.getElementById("messages");
  messagesList.innerHTML = "";
}
function formatTime(hours, minutes) {
  const ampm = hours > 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${formattedHours} : ${minutes} ${ampm}`;
}

// Listen for incoming messages
socket.on("chat message", ({ userId, username, message, type }) => {
  const messagesList = document.getElementById("messages");
  const li = document.createElement("li");
  //Checking for type of message
  let messageClass = "";

  if (type === "join") {
    messageClass = "join-message";
  } else if (type === "disconnect") {
    messageClass = "disconnect-message";
  } else {
    messageClass = "regular-message";
  }
  //time stamp
  const timeStampElement = document.createElement("span");
  const timestamp = formatTime(
    currentDate.getHours(),
    currentDate.getMinutes()
  );
  timeStampElement.classList.add("timestamp");
  timeStampElement.textContent = timestamp;
  //message
  const messageElement = document.createElement("span");
  messageElement.classList.add("message", messageClass);
  messageElement.textContent = `${username || userId}: ${message}`;

  li.appendChild(messageElement);
  li.appendChild(document.createTextNode(" ")); // Add space between message and timestamp
  li.appendChild(timeStampElement);
  messagesList.appendChild(li);
});

//listen for the form submission

const nameForm = document.getElementById("name-form");
nameForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim();

  if (username) {
    socket.emit("user joined", username);
  }
  const nameFormContainer = document.getElementById("name-form-container");

  nameFormContainer.style.display = "none";
});
