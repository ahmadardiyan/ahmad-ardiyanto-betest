import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routerV1 from './routes/v1/index.js';

dotenv.config();

const app = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  mongoose.connect(process.env.DATABASE_URL)
  const database = mongoose.connection;

  database.on('error', (error) => {
      console.log(error)
  })

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.get('/', (req, res) => {
    res.send('Hello! Welcome to the API');
  })

  app.use('/api/v1', routerV1)

  app.listen(PORT, () => {
    console.log(`application is running on port: ${PORT}`)
  })
};

app();
