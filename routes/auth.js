const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../queries'); // Import koneksi ke database PostgreSQL

// Middleware untuk otentikasi user (contoh)
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validasi email dan password, lalu buat token jika sesuai
    // Gantilah logika validasi ini sesuai kebutuhan Anda, contoh ini sangat sederhana
    if (email === 'user@example.com' && password === 'password') {
        const user = { email: email };
        const token = jwt.sign(user, 'scipio'); // Ganti dengan kunci rahasia yang kuat
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Gagal login' });
    }
});

router.post('/register', (req, res) => {
    const { email, password, gender, role } = req.body;

    // Cek apakah email sudah terdaftar
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error;
        }

        if (results.rows.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Jika email belum terdaftar, tambahkan pengguna baru
        pool.query(
            'INSERT INTO users (email, password, gender, role) VALUES ($1, $2, $3, $4) RETURNING id',
            [email, password, gender, role],
            (error, results) => {
                if (error) {
                    throw error;
                }

                // Buat token otentikasi untuk pengguna yang baru mendaftar
                const user = {
                    email: email,
                    id: results.rows[0].id
                };
                const token = jwt.sign(user, 'scipio'); // Ganti dengan kunci rahasia yang kuat
                res.json({ message: 'Pendaftaran berhasil', token });
            }
        );
    });
});

function authorize(req, res, next) {
    // Periksa token otentikasi
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });

    try {
        const decoded = jwt.verify(token, 'scipio'); // Ganti dengan kunci rahasia yang sesuai
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Token tidak valid.' });
    }
}

module.exports = { router, authorize }; 