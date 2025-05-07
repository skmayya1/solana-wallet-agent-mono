import express from 'express';
import router from './routes/index';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
