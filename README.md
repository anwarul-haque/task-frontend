# Task Manager - Frontend

An Angular 19 frontend for the Task Manager application. Supports role-based access (Manager, Team Lead, Employee) with real-time updates via Socket.IO.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later
- Angular CLI v19: `npm install -g @angular/cli`
- The backend API running at `http://localhost:3000`

## Setup

1. **Clone the repository and navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the backend URL** (optional):

   Edit [src/environments/environment.ts](src/environments/environment.ts) and update `backendUrl` if your backend runs on a different host/port:

   ```ts
   export const environment = {
     production: false,
     backendUrl: 'http://localhost:3000'
   };
   ```

## Running the App

```bash
npm start
```

The app will be available at `http://localhost:4200`.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the dev server at `http://localhost:4200` |
| `npm run build` | Build for production (output: `dist/`) |
| `npm run watch` | Build in watch mode for development |
| `npm test` | Run unit tests via Karma |

## Routes

| Path | Access | Description |
|---|---|---|
| `/login` | Public | Sign in to your account |
| `/register` | Public | Create a new account |
| `/tasks` | Authenticated | View and manage tasks |
| `/users` | Manager only | Manage users |

## User Roles

- **Manager** — full access including user management
- **Team Lead** — task management for their team
- **Employee** — view and update assigned tasks

## Tech Stack

- Angular 19
- Bootstrap 5 + ng-bootstrap
- Socket.IO client (real-time updates)
- RxJS
