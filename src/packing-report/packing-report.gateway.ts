import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // sesuaikan ke frontend URL jika production
  },
})
export class PackingReportGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    // console.log('✅ Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    //console.log('❌ Client disconnected:', client.id);
  }

  emitNewPackingEntry() {
    this.server.emit('new-packing-entry');
  }
}
