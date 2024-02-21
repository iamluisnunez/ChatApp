// Connect to the WebSocket server
const socket = io();
const currentDate = new Date();

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
socket.on("chat message", (message) => {
  const messagesList = document.getElementById("messages");
  const li = document.createElement("li");
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
  messageElement.classList.add("message");
  messageElement.textContent = message;

  li.appendChild(messageElement);
  li.appendChild(document.createTextNode(" ")); // Add space between message and timestamp
  li.appendChild(timeStampElement);
  messagesList.appendChild(li);
});
