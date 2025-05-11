import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import redis from './redis';

export class SocketService {
  private io: SocketIOServer;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*', 
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
     
    socket.on('event:msg',async (data) => {
      console.log(data);
      const msgData = {
        data,
        id:socket.id
      }
      await redis.publish('transfer',JSON.stringify(msgData))
    })
    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  }
  public getIO() {
    return this.io;
  }
}
