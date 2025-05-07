import {  Router } from 'express';
import PromptRouter from './prompt'
import { Health } from '../agent';

const router: Router = Router();

router.use('/prompt',PromptRouter)

router.get('/health', async (_req, res) => {
    const llm = await Health() 
    res.json({ llm , message: 'pong' });
  });
  
export default router;
