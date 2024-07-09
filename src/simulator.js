import axios from "axios";
import Exchange from "./exchange.js";

const exchanges = {};

function startExchange(id, bookUrl, dolar = false) {
    exchanges[id] = new Exchange(id);
}

export default { startExchange };