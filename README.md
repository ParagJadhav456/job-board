# Job Board Application

## Overview
This is a full-stack Job Board application built using Next.js.
The application allows recruiters to post job listings and candidates to browse and apply for jobs.

The project is developed incrementally with a strong focus on correctness, clean architecture, and learning.

---

## Tech Stack
- Frontend: Next.js (React, App Router)
- Backend: Next.js API Routes (Node.js)
- Database: SQLite (planned)
- ORM: Prisma (planned)
- Authentication: JWT (planned)

---

## Prerequisites
- Node.js (LTS)
- Git
- VS Code
- GitHub account

---

## Local Setup (Step-by-Step)

### Clone Repository
```bash
git clone https://github.com/ParagJadhav456/job-board.git
cd job-board



- Install Dependencies
npm install

- Run Application
npm run dev


- Open in browser:

http://localhost:3000

- Backend APIs
- Health Check API

    - Endpoint: GET /api/health
    - Purpose: Verify backend availability
    - Sample Response
            {
            "status": "ok",
            "message": "Backend is running fine"
            }

- Version Control Workflow
- Git Initialization
git init
git add .
git commit -m "Initial project setup"
git branch -m main

- Remote Setup
git remote add origin https://github.com/ParagJadhav456/job-board.git
git push -u origin main