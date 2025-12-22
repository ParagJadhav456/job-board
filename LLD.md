# Low Level Design (LLD) – Job Board Application

## Folder Structure

app/
├── api/
│   ├── health/
│   │   └── route.ts
│   ├── auth/
│   │   ├── signup/
│   │   │   └── route.ts
│   │   └── login/
│   │       └── route.ts
│   ├── users/
│   │   └── route.ts
│   ├── jobs/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── apply/
│   │           └── route.ts
│   └── applications/
│       └── me/
│           └── route.ts
│
├── lib/
│   └── prisma.ts
│
├── middleware.ts





## Backend API Design

### Health Check API
- Endpoint: `GET /api/health`
- File Location: `app/api/health/route.ts`
- Purpose: Verify backend availability


### Signup API

- Endpoint: POST /api/auth/signup
- Purpose: Public candidate registration

Input
{
  "name": "string",
  "email": "string",
  "password": "string"
}

- Behavior
    - Validates input
    - Ensures email uniqueness
    - Hashes password using bcrypt
    - Creates user with role CANDIDATE

### Login API

- Endpoint: POST /api/auth/login
- Purpose: Authenticate user and issue JWT

- Output:
{
  "token": "JWT_TOKEN",
  "user": {
    "id": number,
    "name": string,
    "email": string,
    "role": string
  }
}

### Prisma Client Design

- File: 
    app/lib/prisma.ts

- Design Pattern:
    - Singleton PrismaClient instance
    - Prevents multiple DB connections during hot reload in development
    - Logs queries for debugging


### Middleware Design
- File:
      app/middleware.ts

- Responsibilities
    -  Extract JWT from Authorization header
    -  Verify token authenticity
    -  Attach user context to request
    -  Enforce role-based access


### Database Models

- User

| Field     | Type     | Notes             |
| --------- | -------- | ----------------- |
| id        | Int      | Primary Key       |
| name      | String   |                   |
| email     | String   | Unique            |
| password  | String   | Hashed            |
| role      | String   | ADMIN / CANDIDATE |
| createdAt | DateTime | Auto              |



- Job
| Field       | Type     | Notes                             |
| ----------- | -------- | --------------------------------- |
| id          | Int      | Primary Key                       |
| title       | String   |                                   |
| description | String   |                                   |
| company     | String   |                                   |
| location    | String   |                                   |
| jobType     | String   | FULL_TIME / INTERNSHIP / CONTRACT |
| recruiterId | Int      | FK → User                         |
| createdAt   | DateTime | Indexed                           |

- Application

| Field             | Type            | Notes              |
| ----------------- | --------------- | ------------------ |
| id                | Int             | Primary Key        |
| resume            | String          |                    |
| coverNote         | String?         | Optional           |
| userId            | Int             | FK → User          |
| jobId             | Int             | FK → Job           |
| appliedAt         | DateTime        | Auto               |
| Unique Constraint | (userId, jobId) | Prevent duplicates |


### Error Handling Strategy:
 
- Standard HTTP status codes:
      - 400 – Validation errors
      - 401 – Unauthorized
      - 403 – Forbidden
      - 404 – Resource not found
      - 409 – Conflict
      - 500 – Server error



---

## Technology Stack Details
- Language: TypeScript
- Runtime: Node.js
- Framework: Next.js (App Router)

---

## Git Operations

### Local Repository
- `git init` initializes version control
- `git add` stages changes
- `git commit` creates snapshots of project state

### Remote Repositories
- `origin`: Work GitHub repository
- `personal`: Personal GitHub repository

### Push Mechanism
- Code is pushed using `git push`
- Upstream tracking enabled using `-u`
- Authentication handled via GitHub credentials / PAT

---

## Planned Enhancements
- Job Management


