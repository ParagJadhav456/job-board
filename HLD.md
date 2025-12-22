# High Level Design (HLD) – Job Board Application

## System Overview
The Job Board Application is a full-stack web application built using Next.js (App Router).
Both frontend UI and backend APIs are managed within a single unified codebase, following a modern full-stack architecture.

---

## Architecture
- Client (Browser)
- Next.js Application
  - Frontend Pages (React)
  - Backend APIs (Node.js via API Routes)
  - Middleware (JWT-based request validation)
- Database
  - SQLite Database (via Prisma ORM)

## Architecture Diagram

Browser
  ↓ HTTP Requests
Next.js Application
  ├── Frontend (React Pages)
  ├── Middleware (JWT & Role Validation)
  ├── API Routes (Node.js)
  │     ├── Health API
  │     ├── Authentication APIs (Signup, Login)
  │     ├── User APIs
  │     ├── Job APIs
  │     └── Job Application APIs
  └── Prisma ORM
        ↓
     SQLite Database



---

## High Level Flow
1. User accesses application through browser
2. Next.js serves frontend pages
3. Frontend communicates with backend APIs using HTTP
4. Middleware validates JWT (for protected routes) 
5. APIs handle business logic
5. Prisma ORM performs database operations
6. JSON responses are returned to the client

---

## Core Modules
- Authentication Module
    - Signup
    - Login
    - Password hashing
    - JWT generation on login
    - Secure credential storage  
  
    - Authorization Layer
      - JWT verification using middleware
      - Role-based access
        - ADMIN
        - CANDIDATE

    - Database Layer
      - Prisma ORM
      - SQLite database
      - Relational integrity using foreign keys
      - Indexed fields for performance
    - Authentication Data Flow (Signup → Login)

      - Candidate sends signup request
      - Backend validates input 
      - Password is hashed using bcrypt
      - User record stored in database with role CANDIDATE
      - Candidate logs in using email and password
      - JWT token is generated and returned
      - JWT is sent in request headers for protected APIs

    - Security Considerations

      - Passwords are never stored in plain text
      - JWT secret is stored securely in .env
      - Protected APIs require valid JWT
      - Role-based authorization enforced at API layer


- Job Management Module
  - Admin Job creation
  - Public job listing
  - Job detail access

- Job Application Module
  - Candidate Job Application
  - Duplicate application prevention
  - View candidate's own applications





---

## Version Control Strategy
- Git used for version control
- Single primary branch (`main`)
- Frequent, meaningful commits