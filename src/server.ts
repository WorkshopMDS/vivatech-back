import mongoose from 'mongoose';

import app from './app';

const PORT: string | number = process.env.PORT || 4000;
const URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_ADDRESS}/${process.env.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(URI)
    .then(() => console.log('Connected to database!'))
    .catch((error) => {
      throw error;
    });
});
