import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import { userRoutes } from './routes';

const PORT: string | number = process.env.PORT || 4000;
const URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_ADDRESS}/${process.env.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(URI)
    .then(() => console.log('Connected to database!'))
    .catch((error) => {
      throw error;
    });
});
