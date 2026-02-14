# ምርኩዜ Merkuze - Tikur Anbessa Hospital AI Assistant

A hospital AI chatbot powered by Ollama (gemma:3.1b) designed to assist patients and visitors at Tikur Anbessa Specialized Hospital in Ethiopia. The chatbot provides information about departments, doctors, appointments, and other hospital services through an intuitive and modern interface.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Demo Screenshots](#demo-screenshots)
- [Future Enhancements](#future-enhancements)

## Overview

Merkuze (ምርኩዜ) is an intelligent hospital assistant that helps users navigate healthcare services at Tikur Anbessa Specialized Hospital. Using Retrieval-Augmented Generation (RAG) technology, the chatbot provides accurate and context-aware responses about hospital departments, medical staff, appointments, and general health inquiries.

## Features

### AI-Powered Conversations

- Powered by Ollama with gemma:3.1b model
- Retrieval-Augmented Generation (RAG) for accurate hospital information
- Multilingual support (English and Amharic)
- Natural and context-aware responses

### User Authentication

- Secure signup and login with JWT tokens
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Session persistence

### Chat Features

- Real-time chat interface
- Chat history storage and retrieval
- Start new conversations
- Resume previous chats
- Typing indicators for better UX

### Admin Dashboard

- Document upload for knowledge base enhancement
- Manage uploaded documents
- Admin-only access control

### User Experience

- Modern and responsive interface
- Floating chat widget on landing page
- Smooth animations and transitions
- Hospital themed color Used

### Backend scheme

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **AI Integration**: Ollama (gemma:3.1b)

### Frontend

- **Framework**: React
- **Routing**: React Router
- **Styling**: CSS3
- **HTTP Client**: Fetch API

### Infrastructure

- **Local AI**: Ollama (running on localhost:11434)
- **Vector Storage**: MongoDB for document storage

## Project Structure

```
landing page/
├── backend/
│   ├── models/
│   │   ├── Chat.js          # Chat model
│   │   └── User.js          # User model
│   ├── routes/
│   │   ├── admin.js         # Admin routes
│   │   ├── auth.js          # Authentication routes
│   │   └── chat.js          # Chat routes
│   ├── middleware/
│   │   └── authMiddleware.js # Auth middleware
│   ├── tikur_anbessa_chunk.json  # Hospital data
│   ├── ingest.js            # Data ingestion script
│   ├── server.js            # Main server file
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MerkuzeChatWidget.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── AdminPage.js
│   │   │   ├── ChatPage.js
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   └── SignupPage.js
│   │   ├── utils/
│   │   │   └── authApi.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
│
├── images/                   # Demo screenshots
├── uploads/                 # Uploaded files
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | `/api/auth/signup` | Register new user |
| POST   | `/api/auth/login`  | Login user        |

### Chat

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | `/api/chat`                 | Send message to AI      |
| GET    | `/api/chat/history`         | Get user's chat history |
| POST   | `/api/chat/new`             | Create new chat         |
| GET    | `/api/chat/:chatId`         | Load specific chat      |
| POST   | `/api/chat/:chatId/message` | Save message to chat    |

### Admin

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| GET    | `/api/admin/documents`     | List uploaded documents |
| POST   | `/api/admin/upload`        | Upload document         |
| DELETE | `/api/admin/documents/:id` | Delete document         |

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Ollama installed locally

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Respectus11/Chatbott.git
   cd Chatbott
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/merkuze
   JWT_SECRET=your-secret-key
   ```

5. **Start Ollama**

   ```bash
   # Make sure Ollama is running with gemma:3.1b model
   ollama serve
   ollama pull gemma3:1b
   ```

6. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod
   ```

7. **Run the backend**

   ```bash
   cd backend
   npm start
   ```

8. **Run the frontend**

   ```bash
   cd frontend
   npm start
   ```

9. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## Configuration

### Environment Variables

| Variable   | Description               | Default                           |
| ---------- | ------------------------- | --------------------------------- |
| PORT       | Server port               | 4000                              |
| MONGO_URI  | MongoDB connection string | mongodb://localhost:27017/merkuze |
| JWT_SECRET | Secret key for JWT        | -                                 |

### Ollama Configuration

The chatbot uses the gemma:3.1b model. Ensure Ollama is running on `http://localhost:11434`.

## Demo Screenshots

### Landing Page

![Landing Page](images/Screenshot%202026-02-14%20185620.png)

### more on landing page 1

![Chat Widget](images/Screenshot%202026-02-14%20185644.png)

### more on landing page 2

![Login Page](images/Screenshot%202026-02-14%20185658.png)

### Login Page

![Login Page](images/Screenshot%202026-02-14%20185707.png)

### Signup Page

![Signup Page](images/Screenshot%202026-02-14%20185720.png)

### Chat Interface

![Chat Interface](images/Screenshot%202026-02-14%20185902.png)

### Admin Page

![Admin Page](images/Screenshot%202026-02-14%20191217.png)

## Future Enhancements

- **Improved AI Memory**: Enable the chatbot to remember conversation context across sessions
- **Multilingual Support**: Expand language options beyond English and Amharic
- **Appointment Booking**: Integrate with hospital appointment system
- **OAuth Integration**: Add Google and Facebook login options

## License

This project is for educational purposes.

## Acknowledgments

- Tikur Anbessa Specialized Hospital for the hospital data
- Ollama for the local AI infrastructure

---

Built with love for improving healthcare access in Ethiopia.
