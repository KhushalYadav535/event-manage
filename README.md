# Project Title

Event Management System

## Description

An Event Management System that allows users to create, manage, and register for events. The application provides a user-friendly interface for event creation and a dashboard to view all events.

## Features

- User registration and authentication
- Create and manage events
- View event details
- Real-time updates for attendees

## Technologies Used

- **Frontend**: React, Axios
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time Communication**: Socket.io

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   JWT_SECRET=your_secret_key
   DB_URI=mongodb://127.0.0.1:27017/eventdb
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

5. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

6. Start the frontend application:
   ```bash
   npm start
   ```

## Usage

- Access the application in your browser at `http://localhost:3000`.
- Use the registration and login features to access the event management functionalities.

## API Endpoints

- **User Registration**: `POST /api/auth/register`
- **User Login**: `POST /api/auth/login`
- **Create Event**: `POST /api/events`
- **Get Events**: `GET /api/events`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.
