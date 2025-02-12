const express = require('express'); 
const { check, validationResult } = require('express-validator'); // Import express-validator


const router = express.Router();
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');

// WebSocket (Pass `io` from server)
module.exports = (io) => {

    // Create an event (Protected) with validation
    router.post('/', 
        authMiddleware, 
        [
            check('name').not().isEmpty().withMessage('Name is required'),
            check('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
            check('date').isISO8601().withMessage('Date must be a valid date')
        ], 
        async (req, res) => {

        const { name, description, date } = req.body;
        const errors = validationResult(req); // Validate request
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newEvent = new Event({

            name,
            description,
            date,
            createdBy: req.user.id  // Store user ID
        });

        try {
            await newEvent.save();
            io.emit("eventCreated", newEvent); // Notify all clients
            res.status(201).json({ message: "Event created successfully", event: newEvent });

            res.status(201).json({ message: "Event created successfully", event: newEvent });
        } catch (error) {
            res.status(400).json({ error: "Error creating event" });
        }
    });

    // Get all events (Public)
    router.get('/', async (req, res) => {
        try {
            const events = await Event.find().populate('createdBy', 'email'); // Include creator's email
            res.json(events);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving events" });
        }
    });

    // Update an event (Only event creator)
    router.put('/:id', authMiddleware, async (req, res) => {
        const { name, description, date } = req.body;
        try {
            const event = await Event.findById(req.params.id);

            if (!event) return res.status(404).json({ error: "Event not found" });

            // Restrict update to event creator
            if (event.createdBy.toString() !== req.user.id) {
                return res.status(403).json({ error: "Unauthorized to update this event" });
            }

            event.name = name || event.name;
            event.description = description || event.description;
            event.date = date || event.date;
            await event.save();

            io.emit("eventUpdated", event); // Notify clients
            res.json(event);
        } catch (error) {
            res.status(400).json({ error: "Error updating event" });
        }
    });

    // Delete an event (Only event creator)
    router.delete('/:id', authMiddleware, async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);

            if (!event) return res.status(404).json({ error: "Event not found" });

            if (event.createdBy.toString() !== req.user.id) {
                return res.status(403).json({ error: "Unauthorized to delete this event" });
            }

            await Event.findByIdAndDelete(req.params.id);
            io.emit("eventDeleted", { eventId: req.params.id }); // Notify clients
            res.json({ message: "Event deleted successfully" });
        } catch (error) {
            res.status(400).json({ error: "Error deleting event" });
        }
    });

    return router;
};
