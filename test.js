const mongoose = require('mongoose');
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
require('dotenv').config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: '*' } });

// app.use(express.json());
// app.use(cors());
// app.use('/api/auth', authRoutes);

// Sample route
// app.get('/', (req, res) => {
//   res.send('Server is up and running!');
// });

// WebSocket setup
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('message', (msg) => {
//     console.log('Message received:', msg);
//     socket.emit('message', msg); // Echo the message back
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// Connect to MongoDB

const dbURI = process.env.MONGODB_URL

console.log('Connecting to MongoDB with URI:', dbURI);
main().catch((error) => console.log(error));


async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}







// const express = require('express')
// const { Server } = require("socket.io");

// const http = require('http')
// const path = require('path')
// const app = express();

// const server = http.createServer(app)
// const io = new Server(server);

// io.on('connection', (socket) => {
//     console.log('a user connected');
//   });

// app.use(express.static(path.resolve("./public")))
// app.get('/',(req,res)=>{
//     res.sendFile('./public/index.html')
// })

// server.listen(3000,()=>{
//     console.log('server is running at port 3000')
// })

