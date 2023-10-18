const jwt = require('jsonwebtoken');
const { TokenExpiredError } = require('jsonwebtoken');

function authorize(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });

    try {
        const decoded = jwt.verify(token, 'scipio');
        req.user = decoded;
        next();
    } catch (ex) {
        if (ex instanceof TokenExpiredError) {
            res.status(401).json({ message: 'Token telah kadaluwarsa.' });
        } else {
            res.status(400).json({ message: 'Token tidak valid.' });
        }
    }
}

module.exports = { authorize };