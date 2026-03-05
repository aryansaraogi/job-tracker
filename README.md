# Job Tracker

This repository implements the epic **Job Tracking Site with Link Saving and Login Storage**. It is a MERN stack application allowing users to manage job applications, save job links, and store portal credentials securely.

## Structure

- `backend/` - Node/Express API with MongoDB models
- `frontend/` - React application

## Getting Started

1. **Backend**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

The frontend proxies `/api` requests to the backend.

## Features (initial scope)

- User registration and login (JWT authentication)
- CRUD endpoints for jobs and portal credentials
- Basic React views for auth and job list

This is the foundation of the epic; future iterations will add pipeline customization, kanban/list views, and credential masking.
