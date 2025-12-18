# High Level Design (HLD) – Job Board Application

## System Overview
The Job Board Application is a full-stack web application built using Next.js.
Both frontend and backend are managed in a single codebase.

---

## Architecture
- Client (Browser)
- Next.js Application
  - Frontend Pages (React)
  - Backend APIs (Node.js via API Routes)
- SQLite Database (via Prisma ORM)

---

## High Level Flow
1. User accesses application through browser
2. Next.js serves frontend pages
3. Frontend communicates with backend APIs using HTTP
4. Backend APIs handle business logic
5. Database operations are performed
6. JSON responses are returned

---

## Core Modules
- Authentication Module
- Job Management Module
- Job Application Module
- Admin Dashboard Module

---

## Version Control Strategy
- Git used for version control
- Single primary branch (`main`)
- Frequent, meaningful commits