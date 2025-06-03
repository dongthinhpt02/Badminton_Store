import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
import appConfig from '../../../shared/common/config';

// 2 Map lưu trữ WebSocket kết nối theo userId và shipperId
const userSockets = new Map<string, Set<WebSocket>>();
const shipperSockets = new Map<string, Set<WebSocket>>();

// Tạo WebSocket server
const wss = new WebSocketServer({ port: appConfig.SOCKET.port });

wss.on('connection', (ws, req) => {
  // Lấy query param từ url để xác định userId hoặc shipperId
  const params = url.parse(req.url || '', true).query;

  // Giả sử client connect với url như ws://host:8080/?userId=xxx hoặc ?shipperId=yyy
  const userId = typeof params.userId === 'string' ? params.userId : null;
  const shipperId = typeof params.shipperId === 'string' ? params.shipperId : null;

  if (userId) {
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId)!.add(ws);
    console.log(`User connected: ${userId}, total connections: ${userSockets.get(userId)!.size}`);
  } else if (shipperId) {
    if (!shipperSockets.has(shipperId)) {
      shipperSockets.set(shipperId, new Set());
    }
    shipperSockets.get(shipperId)!.add(ws);
    console.log(`Shipper connected: ${shipperId}, total connections: ${shipperSockets.get(shipperId)!.size}`);
  } else {
    console.warn('Connection without userId or shipperId, will be closed');
    ws.close();
    return;
  }

  ws.on('close', () => {
    if (userId && userSockets.has(userId)) {
      userSockets.get(userId)!.delete(ws);
      if (userSockets.get(userId)!.size === 0) userSockets.delete(userId);
      console.log(`User disconnected: ${userId}`);
    }
    if (shipperId && shipperSockets.has(shipperId)) {
      shipperSockets.get(shipperId)!.delete(ws);
      if (shipperSockets.get(shipperId)!.size === 0) shipperSockets.delete(shipperId);
      console.log(`Shipper disconnected: ${shipperId}`);
    }
  });

  ws.on('error', (e) => {
    console.log('WebSocket error:', e);
  });
});

export { userSockets, shipperSockets };
