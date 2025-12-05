YouTube Tweet – Smart Task Planner (Full-Stack MERN)

This project is a Smart Task Planner + Social Feed platform inspired by YouTube UI + Twitter tweeting features.
It allows users to create accounts, post tweets, manage tasks, track progress, and interact with content — all in a clean MERN-stack application.


Features
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



Tech Stack
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

YouTube_Tweet/
│── backend/       # Node.js + Express + MongoDB
│── frontend/      # React + Tailwind + RTK Query
│── README.md

Installation & Setup
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



API Endpoints (Important for Assignment)
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
Developer

Kunal Chavhan
MERN Stack Developer | Final Year Student
