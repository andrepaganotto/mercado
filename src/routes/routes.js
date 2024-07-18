import { Router } from "express";

const routes = Router();

//Authentication
import { authorize, checkAuth } from "./auth.js";
routes.post('/authorize', authorize);

//Acounts
import accountsRouter from "./accountsRouter.js";
routes.use('/accounts', checkAuth, accountsRouter);

//Trading
import tradingRouter from "./tradingRouter.js";
routes.use('/accounts/:accountId/:symbol/orders', checkAuth, tradingRouter);

export default routes;