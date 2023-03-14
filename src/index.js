require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routerV1 = require('./routes/v1');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello! Welcome to the API');
})

app.use('/api/v1', routerV1)

app.listen(PORT, () => {
  console.log(`programm is running on port: ${PORT}`)
})