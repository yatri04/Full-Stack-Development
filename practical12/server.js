const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3002;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // for CSS

// Homepage - Calculator Form
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Kids Calculator</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="container">
          <h1>🎉 Fun Calculator 🎉</h1>
          <form action="/calculate" method="post">
            <input type="text" name="num1" placeholder="Enter first number" required />
            <input type="text" name="num2" placeholder="Enter second number" required />
            <select name="operation">
              <option value="add">➕ Add</option>
              <option value="subtract">➖ Subtract</option>
              <option value="multiply">✖ Multiply</option>
              <option value="divide">➗ Divide</option>
            </select>
            <button type="submit">✨ Calculate ✨</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// Handle calculation
app.post("/calculate", (req, res) => {
  let { num1, num2, operation } = req.body;
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.send(`
      <h2 class="error">⚠️ Invalid input! Please enter numbers only.</h2>
      <a href="/">🔙 Try Again</a>
    `);
  }

  let result;
  switch (operation) {
    case "add":
      result = num1 + num2;
      break;
    case "subtract":
      result = num1 - num2;
      break;
    case "multiply":
      result = num1 * num2;
      break;
    case "divide":
      if (num2 === 0) {
        return res.send(
          "<h2 class='error'>⚠️ Division by zero is not allowed!</h2><a href='/'>🔙 Try Again</a>"
        );
      }
      result = num1 / num2;
      break;
    default:
      return res.send(
        "<h2 class='error'>⚠️ Invalid operation!</h2><a href='/'>🔙 Try Again</a>"
      );
  }

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Result</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="container">
          <h2 class="result">✅ Result: ${result}</h2>
          <a href="/">🔄 Try Another</a>
        </div>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 Calculator running at http://localhost:${PORT}`);
});
