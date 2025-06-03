import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080/?userId=67ea27dd7c27fb715438487f');

ws.on('open', () => console.log('User connected'));
ws.on('message', (msg) => console.log('User nhận tin:', msg.toString()));
ws.on('close', () => console.log('User disconnected'));



const ws1 = new WebSocket('ws://localhost:8080/?shipperId=6836c2ee087f0627b7f1825c');

ws1.on('open', () => console.log('Shipper connected'));
ws1.on('message', (msg) => console.log('Shipper nhận tin:', msg.toString()));
ws1.on('close', () => console.log('Shipper disconnected'));
