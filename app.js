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
function formatTime(hours, minutes) {
  const ampm = hours > 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${formattedHours} : ${minutes} ${ampm}`;
}

// Listen for incoming messages
socket.on("chat message", (message) => {
  const messagesList = document.getElementById("messages");
  const li = document.createElement("li");
  const timeStampElement = document.createElement("span");
  const timestamp = formatTime(
    currentDate.getHours(),
    currentDate.getMinutes()
  );

  timeStampElement.classList.add("timestamp");
  timeStampElement.textContent = timestamp;

  li.appendChild(document.createTextNode(message + " "));
  li.appendChild(timeStampElement);
  messagesList.appendChild(li);
});
