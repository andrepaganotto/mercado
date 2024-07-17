import crypto from 'node:crypto';

export default class Exchange {
    constructor(id) {
        this.id = id;
        this.orderbook = {
            bids: undefined,
            asks: undefined
        };
        this.orders = {};

        this.baseUrl = 'https://api.mercadobitcoin.net/api/v4';
        this.streamUrl = 'wss://ws.mercadobitcoin.net/ws';
    }

    generateOrderId() {
        let id = crypto.randomBytes(16).toString('hex');

        if (this.orders[id]) id = this.generateOrderId();

        this.orders[id] = {}
        return id;
    }

    createOrder(symbol, type, side, amount, price) {

        return {
            orderId: this.generateOrderId()
        };
    }

    getOrder() {

    }

    cancelOrder(id) {

    }
}