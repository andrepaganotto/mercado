import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => res.send('Hello world').end());

const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    const urlParts = req.url.split('/');
    const orderbookId = urlParts[urlParts.length - 1];

    if (orderbookId === '12345') {
        ws.send(JSON.stringify(orderbook));
    }

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function broadcast(data) {
    for (let client of wss.clients) {
        if (client.readyState === client.OPEN) client.send(JSON.stringify(data));
    }
}