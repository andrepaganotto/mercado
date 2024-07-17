import jwt from 'jsonwebtoken';
import { isBlacklisted } from '../controllers/authController.js';

export default ((req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && !isBlacklisted(token)) {
                res.locals.token = decoded;
                return next();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    res.status(401).end();
})

const users = {
    //login: 'password'
    admin: 'admin',
    user: '123'
};

export async function login(req, res) {
    const { login, password } = req.body;
    const user = users[login];

    if (user) {
        const passwordIsValid = await bcrypt.compare(password, userSettings.password);
        if (passwordIsValid) {
            const token = jwt.sign({ id: userSettings.id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_EXPIRES) })
            return res.json({
                "access_token": "01GF442ATTVP4M6M0XGHQYT544",
                "expiration": 1666116857
            });
        }
    }

    return res.status(401).end();
}

const blacklist = [];

export function logout(req, res) {
    const token = req.headers['authorization'];
    blacklist.push(token);
    res.status(200).end();
}

export function isBlacklisted(token) {
    return blacklist.some(e => e === token);
}