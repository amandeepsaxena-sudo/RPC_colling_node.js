const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();
const bodyParser = require('body-parser')


// Middleware to parse JSON bodies
app.use(express.json());
app.use("/", require("./router/token.js"));
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())
// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// module.exports = app;