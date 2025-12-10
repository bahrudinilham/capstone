# LearnTrack Dashboard

A full-stack learning progress tracking application built with Vue.js and Express.js.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)

## Overview

LearnTrack Dashboard helps students monitor their learning progress with:

- **Weekly activity summary** with interactive charts
- **Learning path progress** tracking
- **Standalone course** management
- **KPI dashboard** (courses, learning hours, assessments)
- **Smart recommendations** for next learning paths

## Tech Stack

| Layer    | Technologies                                           |
| -------- | ------------------------------------------------------ |
| Frontend | Vue 3, Vite, Pinia, Vue Router, Tailwind CSS, Chart.js |
| Backend  | Node.js, Express 5, Prisma ORM, JWT                    |
| Database | MySQL 8+                                               |

## Project Structure

```
capstone/
├── client/                 # Vue.js frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── views/          # Page components
│   │   ├── stores/         # Pinia state management
│   │   ├── services/       # API service layer
│   │   └── router/         # Vue Router config
│   └── ...
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth middleware
│   │   └── lib/            # Prisma client
│   └── prisma/             # Database schema & migrations
└── docs/                   # Additional documentation
```

## Prerequisites

- **Node.js** 20+
- **MySQL** 8+
- **npm** or **yarn**

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd capstone
```

### 2. Setup the Backend

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="mysql://username:password@localhost:3306/learntrack"
# JWT_SECRET="your-secret-key"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed demo data
npm run prisma:seed

# Start the API server (runs on port 4000)
npm run dev
```

### 3. Setup the Frontend

```bash
cd client

# Install dependencies
npm install

# (Optional) Create .env if API is not on localhost:4000
# echo 'VITE_API_URL=http://localhost:4000' > .env

# Start the development server (runs on port 5173)
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## Environment Variables

### Server (`server/.env`)

| Variable       | Description                      | Example                                           |
| -------------- | -------------------------------- | ------------------------------------------------- |
| `DATABASE_URL` | MySQL connection string          | `mysql://root:password@localhost:3306/learntrack` |
| `JWT_SECRET`   | Secret key for JWT token signing | `your-secret-key-here`                            |

### Client (`client/.env`) - Optional

| Variable       | Description     | Default                 |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |

## API Endpoints

| Method | Endpoint                         | Description                | Auth Required |
| ------ | -------------------------------- | -------------------------- | ------------- |
| GET    | `/health`                        | Health check               | No            |
| POST   | `/api/auth/login`                | User login                 | No            |
| GET    | `/api/dashboard/summary`         | Weekly activity + KPIs     | Yes           |
| GET    | `/api/paths`                     | All learning paths         | Yes           |
| GET    | `/api/paths/:id/detail`          | Learning path details      | Yes           |
| GET    | `/api/courses?type=standalone`   | Standalone courses         | Yes           |
| GET    | `/api/activity/weekly`           | Weekly activity chart data | Yes           |
| GET    | `/api/recommendations/next-path` | Recommended next path      | Yes           |

## Database Schema

```
Student ──┬── StudentProgress ──┬── Course ──── Tutorial
          │                     │
          │                     └── LearningPath
          │
          └── (1:N relationship)
```

### Main Models

- **Student**: User accounts (`student_id`, `name`, `email`)
- **LearningPath**: Learning path groupings
- **Course**: Individual courses with metadata
- **Tutorial**: Course content units
- **StudentProgress**: Tracks student progress per course

## Demo Credentials

After running `npm run prisma:seed`, you can login with:

| Name      | Email                 |
| --------- | --------------------- |
| John Doe  | johndoe@example.com   |
| Demo User | demo@learntrack.local |

> **Note**: This application uses name + email authentication (no password required for demo purposes).

## Available Scripts

### Server

| Command                   | Description              |
| ------------------------- | ------------------------ |
| `npm run dev`             | Start development server |
| `npm run start`           | Start production server  |
| `npm run prisma:generate` | Generate Prisma client   |
| `npm run prisma:migrate`  | Run database migrations  |
| `npm run prisma:seed`     | Seed demo data           |

### Client

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

## Troubleshooting

### "Environment variable not found: DATABASE_URL"

1. Ensure `server/.env` file exists with `DATABASE_URL`
2. Restart the server after creating/modifying `.env`

### "Cannot connect to MySQL"

1. Verify MySQL service is running: `sudo systemctl status mysqld`
2. Check credentials in `DATABASE_URL`
3. Ensure the database exists: `CREATE DATABASE learntrack;`

### "Invalid token" errors

1. Verify `JWT_SECRET` is set in `server/.env`
2. Clear browser storage and login again

## Documentation

For more detailed documentation, see:

- [Project Overview](./docs/PROJECT_OVERVIEW.md)
- [API Documentation](./docs/PROJECT_DOCUMENTATION.md)

## License

ISC
