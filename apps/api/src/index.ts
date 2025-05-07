import express from 'express';
import ApiRouter from './routes';
import { actionEventListners } from './agent/subscriber';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api', ApiRouter);

actionEventListners()

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
