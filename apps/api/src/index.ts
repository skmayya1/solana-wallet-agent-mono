import express from 'express';
import http from 'http';
import ApiRouter from './routes';
import cors from 'cors'
import { SocketService } from './socket';
import { Listners } from './agent/listeners';

const app = express();
const server = http.createServer(app); 
export const socketService = new SocketService(server);

 Listners()

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())
app.use('/api', ApiRouter);

server.listen(PORT, () => {
  console.log(`API + WebSocket running on port ${PORT}`);
});
