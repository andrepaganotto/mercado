function login({ login, password }) {
    
}

export function authorize(req, res) {
    const data = req.body;

    if (!data || !data.login)
        return res.status(422).json({
            code: "API|REQUEST|LOGIN_MUST_BE_REQUIRED",
            message: "The param {login} must be {required}"
        });

    if (!data.password)
        return res.status(422).json({
            code: "API|REQUEST|PASSWORD_MUST_BE_REQUIRED",
            message: "The param {password} must be {required}"
        });

    const validCredentials = login(data);

    if (!validCredentials)
        return res.status(400).json({
            code: "AUTHORIZE|AUTHORIZATION|FORBIDDEN",
            message: "Invalid login or password"
        });

    res.json(validCredentials);
}

export function checkAuth(req, res, next) {

}