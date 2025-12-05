🚀 Features
✅ Task Planner

Create, edit, delete tasks

Progress tracking

Smart suggestions (AI-ready structure)

Timeline-based planning

📝 Tweet System

Create tweets

View user tweets

Like & unlike posts

View profiles

🎥 YouTube-Style UI

Sidebar

Video-style cards

Channel-like profile view

🔒 Authentication

JWT-based secure login

Protected routes

Role-based access (optional extension)

🧰 Tech Stack
Frontend

React

Vite

TailwindCSS

Redux Toolkit (RTK Query API)

Backend

Node.js

Express

MongoDB + Mongoose

JWT authentication

📂 Project Structure
YouTube_Tweet/
│── backend/       # Node.js + Express + MongoDB
│── frontend/      # React + Tailwind + RTK Query
│── README.md

⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/Kunal112137/YouTube_Tweet.git
cd YouTube_Tweet

2. Setup Backend
cd backend
npm install
npm start

3. Setup Frontend
cd frontend
npm install
npm run dev

📌 API Endpoints (Important for Assignment)
User Routes

POST /auth/register

POST /auth/login

GET /user/:userId

Tweet Routes

POST /tweets

GET /tweets/user/:userId

PUT /tweets/like/:tweetId

Task Routes

POST /tasks

GET /tasks

PUT /tasks/:taskId

🎯 What Problem Does This Project Solve?

✔ Helps users plan tasks efficiently
✔ Provides a social experience like Twitter
✔ Uses modular & production-ready code, suitable for real-world development
✔ Demonstrates full-stack capability for internship selection

👨‍💻 Developer

Kunal Chavhan
MERN Stack Developer | Final Year Student
