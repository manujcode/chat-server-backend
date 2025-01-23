const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    console.log(verified,"mmm")
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);

// Sample route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
app.post('/signup',async(req,res)=>{
  const { email, password } = req.body;
  console.log(req.body,"ccccc")
  
  const userExists =  await User.findOne({email:email});
  console.log(userExists)
  if(!email||!password){
    return res.status(400).json({message:"provide full credential"})
  }
  if (userExists) {
    return res.status(400).json({ message: `User already exists`});
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save the user
  const user = new User({email:email,password:hashedPassword})
  user.save()
  res.status(201).json({ message: "User created successfully" });
  console.log("xxxxxxxxxxxxxxxxxxxxx")
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({email});
  console.log(user)
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT Token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// WebSocket setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    socket.emit('message', msg); // Echo the message back
  });
  
  socket.on("send-To-Server",(msg)=>{
    console.log("console msg on backend is -",msg)
    socket.emit("send-to-user",msg);
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get("/protected", verifyToken, (req, res) => {
  console.log(req.user.email)
  res.json({ message: req.user.email });
});

// Connect to MongoDB

const dbURI = process.env.MONGODB_URL

console.log('Connecting to MongoDB with URI 11:', dbURI);
main().catch((error) => console.log(error));


async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
server.listen(5000,()=>{
    console.log('server is running at port 5000')
})






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

