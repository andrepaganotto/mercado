import { Router } from "express";
import { getBalances, getAccounts } from "../controllers/accounts.js";

const accountsRouter = Router();

accountsRouter.get('/:accountId/balance', getBalances);

accountsRouter.get('/', getAccounts);

export default accountsRouter;
