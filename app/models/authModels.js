const pool = require('../../config/queries');
const jwt = require('jsonwebtoken');

function loginUser(email, password, callback) {
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            callback(error, null);
            return;
        }

        if (results.rows.length === 1) {
            const user = results.rows[0];
            if (user.password === password) {
                const token = jwt.sign({ email: email, id: user.id }, 'scipio', { expiresIn: '1h' });
                callback(null, token);
            } else {
                callback({ message: 'Gagal login' }, null);
            }
        } else {
            callback({ message: 'Gagal login' }, null);
        }
    });
}

function registerUser(email, password, gender, role, callback) {
    pool.query('SELECT MAX(id) AS max_id FROM users', (error, results) => {
        if (error) {
            callback(error, null);
            return;
        }

        const maxId = results.rows[0].max_id || 0;
        const newId = maxId + 1;

        pool.query(
            'INSERT INTO users (id, email, password, gender, role) VALUES ($1, $2, $3, $4, $5)',
            [newId, email, password, gender, role],
            (error, results) => {
                if (error) {
                    callback(error, null);
                    return;
                }

                const user = {
                    email: email,
                    id: newId
                };
                callback(null, user);
            }
        );
    });
}

module.exports = { loginUser, registerUser };