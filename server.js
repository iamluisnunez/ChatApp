const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const connectedUsers = new Map();

const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");
  let userID = "";

  // Listen for user join event
  socket.on("user joined", (username) => {
    // Creating a userID
    userID = socket.id;

    // Add the user to the map with the username
    connectedUsers.set(userID, { socket, username });

    // Broadcast to all channels that a new user has joined
    io.emit("chat message", {
      userId: userID,
      username: "Server", // Displayed as "Server" for system messages
      message: `${username} has joined the chat`,
      type: "join",
    });
  });
  // Listen for incoming messages
  socket.on("chat message", (message) => {
    // Broadcast the message to all connected clients
    io.emit("chat message", {
      userId: userID,
      username: connectedUsers.get(userID).username, // Get the username associated with the userID
      message: message,
      type: "regular-message",
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = connectedUsers.get(userID);
    if (user) {
      const { username } = user;
      connectedUsers.delete(userID);
      // Broadcast that the user has disconnected along with the user ID and type
      io.emit("chat message", {
        userId: userID,
        username: "Server",
        message: `${username} has disconnected from the chat`,
        type: "disconnect",
      });
    }
  });
});
app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
