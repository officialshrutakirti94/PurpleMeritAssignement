# PurpleMeritAssignment

# Full-Stack Authentication & User Management System

## Overview
This is a secure, scalable, and deployment-ready full-stack web application featuring user authentication, role-based access control (RBAC), and production-ready configurations.  
The backend is implemented using **FastAPI** and the frontend using **React + TypeScript**.

---

## Features

### Backend (FastAPI)

**Phase 1 – Core Functionality**
- User model with fields: `email`, `password`, `role`, `status`
- Signup endpoint for new users
- Login endpoint with JWT token generation
- JWT-protected routes
- Endpoint to fetch current logged-in user

**Phase 2 – Role-Based Access Control**
- **Admin Features:**
  - List users with pagination
  - Activate/deactivate users
- **User Features:**
  - Update profile
  - Change password

**Phase 3 – Production Polish**
- Input validation
- Consistent error response structure
- Unit & integration tests (minimum 5)
- Swagger auto-generated documentation
- Deployment-ready configuration (no hardcoded secrets, CORS enabled)

---

### Frontend (React + TypeScript)
- Signup & Login forms connected to backend
- JWT handling for protected routes
- User dashboard:
  - View profile
  - Update profile
  - Change password
- Admin dashboard:
  - List users with pagination
  - Activate/deactivate users
- Form validation & consistent error handling
- Responsive and user-friendly design

---

## Deployment

### Requirements
- Python 3.10+
- Node.js 18+
- FastAPI
- React + TypeScript

### Backend
Run backend using Uvicorn:
```bash
uvicorn app.main:app --reload
