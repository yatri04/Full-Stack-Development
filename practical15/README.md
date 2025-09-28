MERN Library Portal (Demo)
==========================

What this includes
- server/ : Express server using express-session that stores session info on the server (MemoryStore for demo)
- client/ : React app that calls the API with credentials included to keep the session cookie

Quick start
1. Open two terminals.
2. Server:
   cd server
   npm install
   npm start
3. Client:
   cd client
   npm install
   npm start
4. Open http://localhost:3000 and test login/logout.

Notes & suggestions
- For production, use a persistent session store (connect-mongo or Redis) and enable secure cookies/HTTPS.
- You can dockerize the app or deploy to a platform that supports Node + static hosting.
