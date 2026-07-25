# Kanggo Task Management

A simple fullstack task management application.

The application allows users to register, login, and manage their own tasks. Authentication is implemented using JWT, and each user can only access and manage their own tasks.

## Features

### Authentication
- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected task endpoints
- Automatic logout when authentication becomes invalid or expired

### Task Management
- Create task
- View user's tasks
- Update task
- Delete task
- Filter tasks by status:
  - Pending
  - In Progress
  - Done

### Frontend
- Responsive interface
- Protected routes
- Loading and error states
- Prevention of duplicate form submissions
- Responsive task cards
- Automatic handling of unauthorized API responses

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- mysql2

### Frontend
- React
- Vite
- Axios
- React Router
- Bootstrap

### Development Tools
- Git
- npm

## Project Structure

```text
kanggo-task-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       └── taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── schema.sql
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Tasks.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Requirements

Before running the application, make sure the following are installed:

- Node.js
- npm
- MySQL

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd kanggo-task-management
```

### 1. Database Setup

Create the database by importing:

```text
backend/schema.sql
```

For example, using phpMyAdmin:

1. Open phpMyAdmin.
2. Select the **Import** menu.
3. Choose `backend/schema.sql`.
4. Run the import.

The database and required tables will be created automatically.

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` based on `.env.example`:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kanggo_task_management

JWT_SECRET=your_jwt_secret
```

Run the backend:

```bash
npm run dev
```

The API will run by default at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Vite will display the local frontend URL, typically:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Tasks

All task endpoints require a valid JWT.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get authenticated user's tasks |
| GET | `/api/tasks?status=pending` | Filter tasks by status |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Supported task statuses:

```text
pending
in-progress
done
```

## Authentication

After a successful login, the backend returns a JWT.

The frontend sends the token on protected requests using:

```text
Authorization: Bearer <token>
```

Protected task endpoints verify the JWT before allowing access.

Tasks are scoped by the authenticated user's ID, so users can only access and modify their own tasks.

## Production Build

To verify the frontend production build:

```bash
cd frontend
npm run build
```

The generated production files will be available in:

```text
frontend/dist
```

To check frontend code quality:

```bash
npm run lint
```

## Notes

- `.env` files are intentionally excluded from Git.
- `.env.example` files are provided as configuration templates.
- `node_modules` and frontend build output are not committed.
- Passwords are hashed using bcrypt before being stored in the database.

## Author

Rivaldy Ramadhany