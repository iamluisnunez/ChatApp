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

  //creating a userID
  const userID = socket.id;

  //add the users to the map
  connectedUsers.set(userID, socket);

  //broadcast to all channels the a new users joined
  io.emit("chat message", `${userID} has joined the chat`);

  // Listen for incoming messages
  socket.on("chat message", (message) => {
    // Broadcast the message to all connected clients
    io.emit("chat message", `${userID}: ${message}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
    connectedUsers.delete(userID);
    io.emit(`${userID} has disconnected from the chat`);
  });
});
app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
