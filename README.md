# Job Board Application

## Overview
This is a full-stack Job Board application built using Next.js (App Router) with Node.js-based backend APIs, Prisma ORM, SQLite database, and JWT-based authentication.

The project is developed incrementally with a strong focus on correctness, clean architecture, and learning.

The project is built incrementally, focusing on:
    - Correct backend design
    - lean authentication & authorization
    - Role-based access control
    - Replicable setup from scratch


---

## Tech Stack
- Frontend: Next.js (React, App Router)
- Backend: Next.js API Routes (Node.js runtime)
- Database: SQLite 
- ORM: Prisma
- Authentication: JWT 
- Password Hashing:bcrypt

---

## Local Setup
### Prerequisites
- Node.js (LTS)
- Git
- VS Code
- GitHub account
- Postman / Thunder Client

---

## Local Setup (Step-by-Step)

### Clone Repository
```bash

# Step 1 — Clone & Install
git clone https://github.com/ParagJadhav456/job-board.git
cd job-board



- Install Dependencies
npm install

- Run Application
npm run dev


# Step 2 — Environment Variables

Create .env:

DATABASE_URL="file:./dev.db"
JWT_SECRET="supersecretkey"


Ensure .env is added to .gitignore.

# Step 3 — Database Setup
npx prisma migrate dev

# Step 4 — Run Application
npm run dev
# Open in browser:

http://localhost:3000



# Available APIs


- Backend APIs
- Health Check API

    - Endpoint: GET /api/health
    - Purpose: Verify backend availability
    - Sample Response
            {
            "status": "ok",
            "message": "Backend is running fine"
            }
- Authentication
    POST /api/auth/signup
    POST /api/auth/login




# Authentication Flow

- User signs up (Candidate)
- User logs in
- JWT token is issued

- Token is sent in Authorization: Bearer <token> header for protected APIs







- Version Control Workflow
- Git Initialization
git init
git add .
git commit -m "Complete backend APIs till Authentication, Job, Applicaations"
git branch -m main


- Remote Setup
git remote add origin https://github.com/ParagJadhav456/job-board.git
git push -u origin main

```


# Project Status

<!-- ✅ Phase 1 — Authentication & Authorization completed

⏳ Phase 2 — Job Management (pending) -->
