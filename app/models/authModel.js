const pool = require('../../config/queries'); // Pastikan sesuaikan dengan letak file Anda

// Query functions for authentication
const getUserByEmail = (email, callback) => {
    pool.query('SELECT * FROM users WHERE email = $1', [email], callback);
};

const createUser = (email, password, gender, role, callback) => {
    pool.query(
        'INSERT INTO users (email, password, gender, role) VALUES ($1, $2, $3, $4)',
        [email, password, gender, role],
        callback
    );
};

module.exports = {
    getUserByEmail,
    createUser,
};
