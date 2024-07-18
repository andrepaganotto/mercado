import axios from "axios";
const baseURL = 'https://api.mercadobitcoin.net/api/v4';

let access_token, accountId, orderId, marketOrderId;

describe('AUTHORIZE - Mercado Bitcoin API', () => {
    it('200 - Should return access token and expiration', async () => {
        const body = {
            login: '26e43e69db2976be79ba28a9512465be1921ca30ca9a1efe53c272bcee0fb424',
            password: '0bdcc84987b7d1a543885f78f8a7f870afa1940be7505ca527664774d02d3c7a'
        }
        const resp = await axios.post(`${baseURL}/authorize`, body);
        access_token = resp.data.access_token;
        expect(resp.status).toBe(200);
        expect(resp.data).toEqual({
            access_token: expect.any(String),
            expiration: expect.any(Number)
        });
    });

    it('422 - When an empty object is sent', async () => {
        try {
            await axios.post(`${baseURL}/authorize`);
        }
        catch (error) {
            expect(error.response.status).toBe(422);
            expect(error.response.data).toEqual({
                code: "API|REQUEST|LOGIN_MUST_BE_REQUIRED",
                message: "The param {login} must be {required}"
            });
        }
    });

    it('422 - When the login parameter is omitted', async () => {
        try {
            await axios.post(`${baseURL}/authorize`, { password: 'foo' });
        }
        catch (error) {
            expect(error.response.status).toBe(422);
            expect(error.response.data).toEqual({
                code: "API|REQUEST|LOGIN_MUST_BE_REQUIRED",
                message: "The param {login} must be {required}"
            });
        }
    });

    it('422 - When the password parameter is omitted', async () => {
        try {
            await axios.post(`${baseURL}/authorize`, { login: 'foo' });
        }
        catch (error) {
            expect(error.response.status).toBe(422);
            expect(error.response.data).toEqual({
                code: "API|REQUEST|PASSWORD_MUST_BE_REQUIRED",
                message: "The param {password} must be {required}"
            });
        }
    });

    it('400 - When the login and/or password are invalid', async () => {
        try {
            await axios.post(`${baseURL}/authorize`, { login: 'foo', password: 'bar' });
        }
        catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                code: "AUTHORIZE|AUTHORIZATION|FORBIDDEN",
                message: "Invalid login or password"
            });
        }
    });
});

describe('ACCOUNT - Mercado Bitcoin API', () => {
    describe('List accounts', () => {
        it('200 - Should return a list of user accounts', async () => {
            const resp = await axios.get(`${baseURL}/accounts`, { headers: { Authorization: `Bearer ${access_token}` } });
            accountId = resp.data[0].id;
            expect(resp.status).toBe(200);
            expect(resp.data).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        name: expect.any(String),
                        type: expect.any(String),
                        currency: expect.any(String),
                        currencySign: expect.any(String)
                    }),
                ])
            );
        })

        it('403 - When there is no Authorization header', async () => {
            try {
                await axios.get(`${baseURL}/accounts`)
            }
            catch (error) {
                expect(error.response.status).toBe(403);
                expect(error.response.data).toEqual({
                    code: "API|FORBIDDEN",
                    message: "You need to be authenticated"
                });
            }
        })

        it('403 - When the Authorization token is not decodable', async () => {
            try {
                await axios.get(`${baseURL}/accounts`, { headers: { Authorization: 'foo' } });
            }
            catch (error) {
                expect(error.response.status).toBe(403);
                expect(error.response.data).toEqual({
                    code: "API|FORBIDDEN",
                    message: "You need to be authenticated"
                });
            }
        })

        it('401 - When the Authorization token is decodable but not valid or expired', async () => {
            try {
                await axios.get(`${baseURL}/accounts`, { headers: { Authorization: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzpoeWRyYS5qd3QuYWNjZXNzLXRva2VuIiwidHlwIjoiSldUIn0.eyJhdWQiOltdLCJjbGllbnRfaWQiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIiwiZXhwIjoxNzIxMDUxNjA2LCJleHQiOnt9LCJpYXQiOjE3MjEwNDgwMDYsImlzcyI6Imh0dHBzOi8vc2VydmljZS1hY2NvdW50cy5tZXJjYWRvYml0Y29pbi5uZXQvIiwianRpIjoiYjNlYTgwNjAtNzc4My00NGE1LWE1ZmMtYmUwNzI4ZWQ3Y2FjIiwibmJmIjoxNzIxMDQ4MDA2LCJzY3AiOlsicHJvZmlsZSIsImdsb2JhbCJdLCJzdWIiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIn0.v1kuR5kv6gtGuv3z8FPzZi1boDtJ4-Q5kZtTUUt3P_7A64C8yWgCKwnxXZ0JzrwhY1pguwoxg5GwxAMLZyPS5rsMLopl49aP_9qSY6zqY4onFe975vUCLYM7M3iJuk3P-7rorLfZVqRavD6qotUyq9cMM1zRjoTGvWScRVWtQFqQO6NgPxTRjYtAsCkABPpO57gICtbq5Y3KesO5jeZPy6saIpNl5LPCKXGbngXFEwUJc2Pkzw7cdu6rQkdErBmV7SbZ8gSHz9MJgolvMFVvsjUVdsWkDXmomUxih-19z8gNkLWyMFL0qI269EGLsangZcvECxXRpRVZfhsEWkK160AufSFyARwXqYPWIQK6e9U7o1-K4dLAJmuJXjeA9slxQAtwbsD5GHBS7tr0VGN1SCa7p1tCPVuXoFj8Eyl9ejKNrNhjmux9dpMBETDoSedNvC3Xm1VNLIxPqnYYRjs5W5w9eOrHHve34pkGV18PskK2O7x1PjqEy9EMlxS2dRpR_AeCaRLsChLRFDgCkVM5WAbyFbg9R25ICGHETbknW0Eq3RhSgGGfqY_q_kxaOlcfZdyz2utUGp7I9y8-366BV5Vf2wX0qCuzNlx7uhxPnyaTILXWA6_2sy-P0kcCFzOVuNk3jXa91dbYvkBTXTMpWU0ms6hwl43yw7g3H81x9XQ' } })
            }
            catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toEqual({
                    error: {
                        code: 401,
                        status: "Unauthorized",
                        message: "The request could not be authorized"
                    }
                });
            }
        })
    })

    describe('Get balances', () => {
        it('200 - Should return a list of balances for all available currencies', async () => {
            const resp = await axios.get(`${baseURL}/accounts/${accountId}/balances`, { headers: { Authorization: `Bearer ${access_token}` } });
            expect(resp.status).toBe(200);
            expect(resp.data).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        available: expect.any(String),
                        on_hold: expect.any(String),
                        symbol: expect.any(String),
                        total: expect.any(String)
                    }),
                ])
            );
        })

        it('403 - When the Authorization token is valid and the accountId is invalid', async () => {
            try {
                await axios.get(`${baseURL}/accounts/${undefined}/balances`, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(403);
                expect(error.response.data).toEqual({
                    error: {
                        code: 403,
                        status: "Forbidden",
                        message: "The requested action was forbidden"
                    }
                });
            }
        })

        it('403 - When there is no Authorization header', async () => {
            try {
                await axios.get(`${baseURL}/accounts`)
            }
            catch (error) {
                expect(error.response.status).toBe(403);
                expect(error.response.data).toEqual({
                    code: "API|FORBIDDEN",
                    message: "You need to be authenticated"
                });
            }
        })

        it('403 - When the Authorization token is not decodable', async () => {
            try {
                await axios.get(`${baseURL}/accounts`, { headers: { Authorization: 'foo' } });
            }
            catch (error) {
                expect(error.response.status).toBe(403);
                expect(error.response.data).toEqual({
                    code: "API|FORBIDDEN",
                    message: "You need to be authenticated"
                });
            }
        })

        it('401 - When the Authorization token is decodable but not valid or expired', async () => {
            try {
                await axios.get(`${baseURL}/accounts`, { headers: { Authorization: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzpoeWRyYS5qd3QuYWNjZXNzLXRva2VuIiwidHlwIjoiSldUIn0.eyJhdWQiOltdLCJjbGllbnRfaWQiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIiwiZXhwIjoxNzIxMDUxNjA2LCJleHQiOnt9LCJpYXQiOjE3MjEwNDgwMDYsImlzcyI6Imh0dHBzOi8vc2VydmljZS1hY2NvdW50cy5tZXJjYWRvYml0Y29pbi5uZXQvIiwianRpIjoiYjNlYTgwNjAtNzc4My00NGE1LWE1ZmMtYmUwNzI4ZWQ3Y2FjIiwibmJmIjoxNzIxMDQ4MDA2LCJzY3AiOlsicHJvZmlsZSIsImdsb2JhbCJdLCJzdWIiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIn0.v1kuR5kv6gtGuv3z8FPzZi1boDtJ4-Q5kZtTUUt3P_7A64C8yWgCKwnxXZ0JzrwhY1pguwoxg5GwxAMLZyPS5rsMLopl49aP_9qSY6zqY4onFe975vUCLYM7M3iJuk3P-7rorLfZVqRavD6qotUyq9cMM1zRjoTGvWScRVWtQFqQO6NgPxTRjYtAsCkABPpO57gICtbq5Y3KesO5jeZPy6saIpNl5LPCKXGbngXFEwUJc2Pkzw7cdu6rQkdErBmV7SbZ8gSHz9MJgolvMFVvsjUVdsWkDXmomUxih-19z8gNkLWyMFL0qI269EGLsangZcvECxXRpRVZfhsEWkK160AufSFyARwXqYPWIQK6e9U7o1-K4dLAJmuJXjeA9slxQAtwbsD5GHBS7tr0VGN1SCa7p1tCPVuXoFj8Eyl9ejKNrNhjmux9dpMBETDoSedNvC3Xm1VNLIxPqnYYRjs5W5w9eOrHHve34pkGV18PskK2O7x1PjqEy9EMlxS2dRpR_AeCaRLsChLRFDgCkVM5WAbyFbg9R25ICGHETbknW0Eq3RhSgGGfqY_q_kxaOlcfZdyz2utUGp7I9y8-366BV5Vf2wX0qCuzNlx7uhxPnyaTILXWA6_2sy-P0kcCFzOVuNk3jXa91dbYvkBTXTMpWU0ms6hwl43yw7g3H81x9XQ' } })
            }
            catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toEqual({
                    error: {
                        code: 401,
                        status: "Unauthorized",
                        message: "The request could not be authorized"
                    }
                });
            }
        })
    })
});

describe('TRADING - Mercado Bitcoin API', () => {
    //Order of checks:
    //Route (symbol in wrong form results in wrong route) > Auth > Path (accountId) > Body > Path parameters

    //When checking the qty parameter it checks first the min and max amount, and then checks if the user has enough balance, and then it checks the min and max price

    describe('Place Order', () => {
        it('200 - (LIMIT) Should return the orderId', async () => {
            const symbol = 'REZ-BRL';
            const body = {
                side: 'sell',
                type: 'limit',
                qty: '50',
                limitPrice: 0.5005
            }
            const resp = await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            orderId = resp.data.orderId;
            expect(resp.status).toBe(200);
            expect(resp.data).toEqual({
                orderId: expect.any(String)
            });
        })

        it('200 - (MARKET) Should return the orderId', async () => {
            const symbol = 'REZ-BRL';
            const body = {
                side: 'buy',
                type: 'market',
                qty: '5'
            }
            const resp = await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            marketOrderId = resp.data.orderId;
            expect(resp.status).toBe(200);
            expect(resp.data).toEqual({
                orderId: expect.any(String)
            });
        })

        it('422 - When some field is not the type it was meant to be', async () => {
            try {
                const symbol = 'FOO-BAR';
                const body = {
                    side: 'sell',
                    type: 'limit',
                    qty: 50,
                    limitPrice: '0.5005'
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(422);
                expect(error.response.data).toEqual({
                    code: "API|UNPROCESSABLE_ENTITY",
                    message: expect.any(String) //"The field {FIELD} must be {TYPE THE FIELD SHOULD BE}"
                });
            }
        })

        it('404 - When the symbol is not in correct BASE-QUOTE form', async () => {
            try {
                await axios.post(`${baseURL}/accounts/${accountId}/${undefined}/orders`);
            }
            catch (error) {
                expect(error.response.status).toBe(404);
                expect(error.response.data).toEqual({
                    code: "API|ROUTE_NOT_FOUND",
                    message: "This route not found"
                });
            }
        })

        it('403 - When the Authorization token is valid and the accountId is invalid', async () => {
            try {
                const symbol = 'REZ-BRL';
                await axios.post(`${baseURL}/accounts/${undefined}/${symbol}/orders`, {}, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(403);
                expect(error.response.data).toEqual({
                    error: {
                        code: 403,
                        message: "The requested action was forbidden",
                        status: "Forbidden",
                    }
                });
            }
        })

        it('403 - When there is no Authorization header (accountId can be either valid or not)', async () => {
            try {
                const symbol = 'REZ-BRL';
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, {});
            }
            catch (error) {
                expect(error.response.status).toBe(403);
                expect(error.response.data).toEqual({
                    code: "API|FORBIDDEN",
                    message: "You need to be authenticated"
                });
            }
        })

        it('403 - When the Authorization token is not decodable (accountId can be either valid or not)', async () => {
            try {
                const symbol = 'REZ-BRL';
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, {}, { headers: { Authorization: 'foo' } });
            }
            catch (error) {
                expect(error.response.status).toBe(403);
                expect(error.response.data).toEqual({
                    code: "API|FORBIDDEN",
                    message: "You need to be authenticated"
                });
            }
        })

        it('401 - When the Authorization token is decodable but not valid or expired (accountId can be either valid or not)', async () => {
            try {
                const symbol = 'REZ-BRL';
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, {}, { headers: { Authorization: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzpoeWRyYS5qd3QuYWNjZXNzLXRva2VuIiwidHlwIjoiSldUIn0.eyJhdWQiOltdLCJjbGllbnRfaWQiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIiwiZXhwIjoxNzIxMDUxNjA2LCJleHQiOnt9LCJpYXQiOjE3MjEwNDgwMDYsImlzcyI6Imh0dHBzOi8vc2VydmljZS1hY2NvdW50cy5tZXJjYWRvYml0Y29pbi5uZXQvIiwianRpIjoiYjNlYTgwNjAtNzc4My00NGE1LWE1ZmMtYmUwNzI4ZWQ3Y2FjIiwibmJmIjoxNzIxMDQ4MDA2LCJzY3AiOlsicHJvZmlsZSIsImdsb2JhbCJdLCJzdWIiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIn0.v1kuR5kv6gtGuv3z8FPzZi1boDtJ4-Q5kZtTUUt3P_7A64C8yWgCKwnxXZ0JzrwhY1pguwoxg5GwxAMLZyPS5rsMLopl49aP_9qSY6zqY4onFe975vUCLYM7M3iJuk3P-7rorLfZVqRavD6qotUyq9cMM1zRjoTGvWScRVWtQFqQO6NgPxTRjYtAsCkABPpO57gICtbq5Y3KesO5jeZPy6saIpNl5LPCKXGbngXFEwUJc2Pkzw7cdu6rQkdErBmV7SbZ8gSHz9MJgolvMFVvsjUVdsWkDXmomUxih-19z8gNkLWyMFL0qI269EGLsangZcvECxXRpRVZfhsEWkK160AufSFyARwXqYPWIQK6e9U7o1-K4dLAJmuJXjeA9slxQAtwbsD5GHBS7tr0VGN1SCa7p1tCPVuXoFj8Eyl9ejKNrNhjmux9dpMBETDoSedNvC3Xm1VNLIxPqnYYRjs5W5w9eOrHHve34pkGV18PskK2O7x1PjqEy9EMlxS2dRpR_AeCaRLsChLRFDgCkVM5WAbyFbg9R25ICGHETbknW0Eq3RhSgGGfqY_q_kxaOlcfZdyz2utUGp7I9y8-366BV5Vf2wX0qCuzNlx7uhxPnyaTILXWA6_2sy-P0kcCFzOVuNk3jXa91dbYvkBTXTMpWU0ms6hwl43yw7g3H81x9XQ' } });
            }
            catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toEqual({
                    error: {
                        code: 401,
                        status: "Unauthorized",
                        message: "The request could not be authorized"
                    }
                });
            }
        })

        it('400 - When the symbol is in BASE-QUOTE format but is invalid', async () => {
            try {
                const symbol = 'FOO-BAR';
                const body = {
                    side: 'sell',
                    type: 'limit',
                    qty: '50',
                    limitPrice: 0.5005
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|INVALID_PAIR",
                    message: "The params {base} or {quote} are invalid"
                });
            }
        })

        it('400 - When side value is not sent or isnt neither "buy" or "sell"', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {}
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|INVALID_SIDE",
                    message: "The params {side} needs to be buy or sell"
                });
            }
        })

        it('400 - When type value is not sent or isnt "limit" or "market"', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {
                    side: 'sell'
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|INVALID_ORDER_TYPE",
                    message: "Invalid order type"
                });
            }
        })

        it('400 - When qty value is not sent or is empty or is lower than the minimum', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {
                    side: 'sell',
                    type: 'limit'
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|INVALID_MIN_QUANTITY",
                    message: expect.any(String) //'The param {qty} is lower than {MINIMUM QTY}'
                });
            }
        })

        it('400 - When qty is bigger than the maximum allowed for the symbol', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {
                    side: 'sell',
                    type: 'limit',
                    qty: '1000000'
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: 'TRADING|PLACE_ORDER|INVALID_MAX_QUANTITY',
                    message: expect.any(String) //'The param {qty} is higher than {MAXIMUM QTY}'
                });
            }
        })

        it('400 - When there is not enough balance to fulfill the qty', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {
                    side: 'sell',
                    type: 'limit',
                    qty: '5000',
                    limitPrice: 0.5005
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|INSUFFICIENT_BALANCE",
                    message: "Insufficient balance to carry out the operation"
                });
            }
        })

        it('400 - (LIMIT) When limitPrice value is not sent or is lower than the minimum', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {
                    side: 'sell',
                    type: 'limit',
                    qty: '5000'
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|INVALID_MIN_LIMIT_PRICE",
                    message: expect.any(String) //"The param {limitPrice} is lower than {MINIMUM}"
                });
            }
        })

        it('400 - (LIMIT) When limitPrice value is bigger than the maximum allowed', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {
                    side: 'sell',
                    type: 'limit',
                    qty: '50',
                    limitPrice: 100000
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|INVALID_MAX_LIMIT_PRICE",
                    message: expect.any(String) //"The param {limitPrice} is higher than {MAXIMUM}"
                });
            }
        })

        it('400 - (LIMIT) When total order cost (qty * limitPrice) is lower than minimum (around R$ 1) or higher than maximum', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {
                    side: 'buy',
                    type: 'limit',
                    qty: '0.001',
                    limitPrice: 0.175
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|EXCEEDED_COST_LIMIT",
                    message: "The minimum or maximum cost has been exceeded."
                });
            }
        })

        it('400 - (MARKET) When the order cost (qty * first limitPrice on the opposite book side) is lower than R$ 1', async () => {
            try {
                const symbol = 'REZ-BRL';
                const body = {
                    side: 'buy',
                    type: 'market',
                    qty: '1'
                }
                await axios.post(`${baseURL}/accounts/${accountId}/${symbol}/orders`, body, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|PLACE_ORDER|API_GENERIC_ERROR",
                    message: "An unexpected error has occurred"
                });
            }
        })

    })

    describe('Get Order', () => {
        it('200 - Should return order data (no fills)', async () => {
            const symbol = 'REZ-BRL';
            const resp = await axios.get(`${baseURL}/accounts/${accountId}/${symbol}/orders/${orderId}`, { headers: { Authorization: `Bearer ${access_token}` } });
            expect(resp.status).toBe(200);
            expect(resp.data).toEqual({
                id: orderId, //Swapped with the Platform ID when fetching with it
                instrument: symbol,
                fee: expect.any(String),
                qty: expect.any(String),
                side: expect.stringMatching(/^(buy|sell)$/),
                type: expect.stringMatching(/^(market|limit)$/),
                filledQty: expect.any(String),
                limitPrice: expect.any(Number),
                triggerOrderId: expect.any(String), //Not present when fetching with the platform ID
                status: expect.stringMatching(/^(created|working|cancelled|filled)$/),
                executions: [],
                created_at: expect.any(Number),
                updated_at: expect.any(Number)
            });
        });

        it('200 - Should return order data (filled)', async () => {
            const symbol = 'REZ-BRL';
            const resp = await axios.get(`${baseURL}/accounts/${accountId}/${symbol}/orders/${marketOrderId}`, { headers: { Authorization: `Bearer ${access_token}` } });
            expect(resp.status).toBe(200);
            expect(resp.data).toEqual({
                id: marketOrderId, //Swapped with the Platform ID when fetching with it
                instrument: symbol,
                fee: expect.any(String),
                qty: expect.any(String),
                side: expect.stringMatching(/^(buy|sell)$/),
                type: expect.stringMatching(/^(market|limit)$/),
                filledQty: expect.any(String),
                limitPrice: expect.any(Number),
                triggerOrderId: expect.any(String), //Not present when fetching with the platform ID
                status: expect.stringMatching(/^(created|working|cancelled|filled)$/),
                avgPrice: expect.any(Number),
                executions: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        instrument: symbol,
                        price: expect.any(Number),
                        qty: expect.any(String),
                        side: expect.stringMatching(/^(buy|sell)$/),
                        fee_rate: expect.any(String),
                        executed_at: expect.any(Number),
                        liquidity: expect.stringMatching(/^(taker|maker)$/)
                    }),
                ]),
                created_at: expect.any(Number),
                updated_at: expect.any(Number)
            });
        });

        it('400 - When the symbol is in BASE-QUOTE format but is invalid', async () => {
            try {
                const symbol = 'FOO-BAR';
                await axios.get(`${baseURL}/accounts/${accountId}/${symbol}/orders/${orderId}`, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|GET_ORDER|INVALID_PAIR",
                    message: "{Base} or {Quote} is invalid"
                });
            }
        })

        it('400 - When the orderId is invalid', async () => {
            try {
                const symbol = 'REZ-BRL';
                await axios.get(`${baseURL}/accounts/${accountId}/${symbol}/orders/${undefined}`, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|GET_ORDER|ORDER_NOT_FOUND",
                    message: "Order not found"
                });
            }
        })
    })

    describe('Cancel Order', () => {
        it('200 - Should return an empty object', async () => {
            const symbol = 'REZ-BRL';
            const resp = await axios.delete(`${baseURL}/accounts/${accountId}/${symbol}/orders/${orderId}`, { headers: { Authorization: `Bearer ${access_token}` } });
            expect(resp.status).toBe(200);
            expect(resp.data).toEqual({});
        });

        it('400 - When the orderId is invalid', async () => {
            try {
                const symbol = 'REZ-BRL';
                await axios.delete(`${baseURL}/accounts/${accountId}/${symbol}/orders/${undefined}`, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|CANCEL_ORDER|ORDER_NOT_FOUND",
                    message: "Order not found"
                });
            }
        })

        it('400 - When the orderId status is "filled"', async () => {
            try {
                const symbol = 'REZ-BRL';
                await axios.delete(`${baseURL}/accounts/${accountId}/${symbol}/orders/${marketOrderId}`, { headers: { Authorization: `Bearer ${access_token}` } });
            }
            catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    code: "TRADING|CANCEL_ORDER|INVALID_STATUS",
                    message: "Order status is invalid"
                });
            }
        })
    })
});

// async function main() {
//     try {
//         await axios.get('https://api.mercadobitcoin.net/api/v4/zuzu', {
//             headers: {
//                 Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzpoeWRyYS5qd3QuYWNjZXNzLXRva2VuIiwidHlwIjoiSldUIn0.eyJhdWQiOltdLCJjbGllbnRfaWQiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIiwiZXhwIjoxNzIxMDUxNjA2LCJleHQiOnt9LCJpYXQiOjE3MjEwNDgwMDYsImlzcyI6Imh0dHBzOi8vc2VydmljZS1hY2NvdW50cy5tZXJjYWRvYml0Y29pbi5uZXQvIiwianRpIjoiYjNlYTgwNjAtNzc4My00NGE1LWE1ZmMtYmUwNzI4ZWQ3Y2FjIiwibmJmIjoxNzIxMDQ4MDA2LCJzY3AiOlsicHJvZmlsZSIsImdsb2JhbCJdLCJzdWIiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIn0.v1kuR5kv6gtGuv3z8FPzZi1boDtJ4-Q5kZtTUUt3P_7A64C8yWgCKwnxXZ0JzrwhY1pguwoxg5GwxAMLZyPS5rsMLopl49aP_9qSY6zqY4onFe975vUCLYM7M3iJuk3P-7rorLfZVqRavD6qotUyq9cMM1zRjoTGvWScRVWtQFqQO6NgPxTRjYtAsCkABPpO57gICtbq5Y3KesO5jeZPy6saIpNl5LPCKXGbngXFEwUJc2Pkzw7cdu6rQkdErBmV7SbZ8gSHz9MJgolvMFVvsjUVdsWkDXmomUxih-19z8gNkLWyMFL0qI269EGLsangZcvECxXRpRVZfhsEWkK160AufSFyARwXqYPWIQK6e9U7o1-K4dLAJmuJXjeA9slxQAtwbsD5GHBS7tr0VGN1SCa7p1tCPVuXoFj8Eyl9ejKNrNhjmux9dpMBETDoSedNvC3Xm1VNLIxPqnYYRjs5W5w9eOrHHve34pkGV18PskK2O7x1PjqEy9EMlxS2dRpR_AeCaRLsChLRFDgCkVM5WAbyFbg9R25ICGHETbknW0Eq3RhSgGGfqY_q_kxaOlcfZdyz2utUGp7I9y8-366BV5Vf2wX0qCuzNlx7uhxPnyaTILXWA6_2sy-P0kcCFzOVuNk3jXa91dbYvkBTXTMpWU0ms6hwl43yw7g3H81x9XQ'
//             }
//         })
//         console.log('SUCCESS');
//     }
//     catch (error) {
//         if(!error.resp) {
//             throw new Error('Unkown Error' + error.message);
//         }

//         const status = error.resp.status;

//         if (error.resp.data.error) {
//             if (status === 404) return; //Not found > throw
//             if (status === 403) return; //Forbidden > throw Invalid account ID
//             if (status === 401) return; //Unauthorized > Get new token > return retry
//         }

//         error = error.resp.data;
//         const [path, endpoint, code] = error.code.split('|');


//         console.error('Error Code', error.code);
//         console.error('HTTP Code', error.resp.status);
//         console.error('Error.message', error.message);
//         console.error('Error.resp.data', error.resp.data);
//     }
// }

// main();