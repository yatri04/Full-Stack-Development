# Cafe Backend API

## Getting Started

### 1. Install dependencies

```
cd backend
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your PostgreSQL credentials and a JWT secret:

```
cp .env.example .env
```

### 3. Set up the database

- Edit `DATABASE_URL` in `.env` to match your PostgreSQL setup.
- Run Prisma migrations (after you add migrations):

```
npx prisma migrate dev --name init
```

### 4. Generate Prisma client

```
npx prisma generate
```

### 5. Run the backend server

```
npm run dev
```

The server will start on `http://localhost:4000` by default.

## Project Structure

- `src/routes/` – Express route definitions
- `src/controllers/` – Request handlers
- `src/services/` – Business logic
- `src/middlewares/` – Authentication, validation
- `src/utils/` – Helper functions
- `src/config/` – DB & env config
- `src/sockets/` – Socket.io setup (optional)
- `src/index.ts` – App entry point

## Features
- User authentication (JWT, bcrypt, role-based)
- Menu management (CRUD, categories)
- Modular, scalable structure

---

For more, see the code and comments in each module.