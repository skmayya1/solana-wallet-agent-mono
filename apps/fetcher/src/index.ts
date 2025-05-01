import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/health', (_req, res) => {
  res.json({ message: 'OK' });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
