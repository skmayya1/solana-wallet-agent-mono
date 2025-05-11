import {  Router } from 'express';
import { Health } from '../agent';

const router: Router = Router();


router.get('/health', async (_req, res) => {
    const llm = await Health() 
    res.json({ llm , message: 'pong' });
  });
  
export default router;
