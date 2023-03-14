const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello! Welcome to the API');
})

app.listen(PORT, () => {
  console.log(`programm is running on port: ${PORT}`)
})