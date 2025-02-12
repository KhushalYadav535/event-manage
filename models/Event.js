const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique event ID

const EventSchema = new mongoose.Schema(
{
    location: { type: String, required: true }, // New field for event location

    eventId: { type: String, unique: true, default: uuidv4 }, // Unique Event ID
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: true, minlength: 10, maxlength: 500 },
    date: { type: Date, default: Date.now }, // Default to current date
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // New field for event attendees

}, { timestamps: true }); // Adds createdAt & updatedAt automatically

module.exports = mongoose.model('Event', EventSchema);
