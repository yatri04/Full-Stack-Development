MERN Library Portal - Server (Express)
-------------------------------------

How to run (server):
1. cd server
2. npm install
3. npm run start   (or npm run dev if you want nodemon)

The server listens by default on port 5000.
API endpoints:
  POST /api/login   -> { name }
  GET  /api/profile -> returns session info if logged in
  POST /api/logout  -> logs out and destroys session

Notes:
- Uses express-session with the default MemoryStore (development only).
- CORS is configured to allow requests from http://localhost:3000 with credentials.
- To use in production, configure a persistent session store (connect-mongo, redis, etc.) and HTTPS.
