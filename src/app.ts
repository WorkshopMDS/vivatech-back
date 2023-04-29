import cors from 'cors';
import express from 'express';
import type { Application } from 'express';

import router from './router';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(router);

export default app;
