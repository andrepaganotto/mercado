import crypto from 'node:crypto';

export default class Exchange {
    constructor(id) {
        this.id = id;
        this.orderbook = {
            bids: undefined,
            asks: undefined
        };
        this.orders = {};
    }

    generateOrderId() {
        let id = crypto.randomBytes(16).toString('hex');

        if (this.orders[id]) id = this.generateOrderId();

        this.orders[id] = {}
        return id;
    }

    createOrder(symbol, type, side, amount, price) {
        const now = Date.now();

        const order = {
            id: this.generateOrderId(),
            clientOrderId: undefined,
            timestamp: now,
            datetime: new Date(now).toISOString(),
            lastTradeTimestamp: undefined,
            lastUpdateTimestamp: now,
            symbol,
            type,
            side,
            amount,
            price,
            cost: undefined,
            average: undefined,
            filled: undefined,
            remaining: undefined,
            status: 'open',
            fee: undefined,
            trades: undefined,
            fees: []
        }

        return order;
    }

    cancelOrder(id) {

    }
}