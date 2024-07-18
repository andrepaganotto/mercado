import { Router } from "express";
import { placeOrder, getOrder, cancelOrder } from "../controllers/trading.js";

const tradingRouter = Router();

tradingRouter.post('/', placeOrder);

tradingRouter.get('/:orderId', getOrder);

tradingRouter.delete('/:orderId', cancelOrder);

export default tradingRouter;