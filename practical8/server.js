const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve HTML page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rep Counter</title>
        <style>
          body {
            text-align: center;
            font-family: Arial, sans-serif;
            padding: 50px;
            background: #f4f4f4;
          }
          #count {
            font-size: 5em;
            margin: 30px;
            color: #2563eb;
          }
          button {
            padding: 15px 30px;
            margin: 10px;
            font-size: 1.5em;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
          }
          button:hover {
            background-color: #1e40af;
          }
        </style>
      </head>
      <body>
        <h1>Exercise Rep Counter</h1>
        <div id="count">0</div>
        <div>
          <button onclick="change(-1)">-</button>
          <button onclick="change(1)">+</button>
          <button onclick="reset()">Reset</button>
        </div>

        <script>
          let count = localStorage.getItem('repCount') || 0;
          let countEl = document.getElementById('count');
          countEl.innerText = count;

          function updateDisplay(value) {
            count = value;
            countEl.innerText = count;
            localStorage.setItem('repCount', count);
          }

          function change(val) {
            updateDisplay(Math.max(0, parseInt(count) + val));
          }

          function reset() {
            updateDisplay(0);
          }
        </script>
      </body>
      </html>
    `);
  } else {
    // Any other route = 404
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
