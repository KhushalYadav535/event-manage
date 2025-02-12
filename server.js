const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Real-time attendee updates
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinEvent", (eventId) => {
        socket.join(eventId);
        console.log(`User joined event ${eventId}`);
    });

    socket.on("updateAttendees", (eventId, count) => {
        io.to(eventId).emit("attendeeUpdated", count);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
