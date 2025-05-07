import {  Router } from 'express';

const router: Router = Router();

router.get('/', (_req,res) => {
    res.json({ message: 'OK' });
});

router.get('/health', (_req, res) => {
    res.json({ message: 'pong' });
  });
  
export default router;
