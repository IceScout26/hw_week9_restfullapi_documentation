const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../queries'); // Import koneksi ke database PostgreSQL

// Middleware untuk otentikasi user (contoh)
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Query ke basis data untuk mencari pengguna dengan email yang cocok
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error;
        }

        if (results.rows.length === 1) {
            // Pengguna ditemukan berdasarkan email, sekarang periksa kata sandi
            const user = results.rows[0];
            if (user.password === password) {
                // Kata sandi cocok, buat token JWT dan kirimkan sebagai respons
                const token = jwt.sign({ email: email, id: user.id }, 'scipio'); // Ganti dengan kunci rahasia yang kuat
                res.json({ token });
            } else {
                // Kata sandi tidak cocok
                res.status(401).json({ message: 'Gagal login' });
            }
        } else {
            // Pengguna tidak ditemukan berdasarkan email
            res.status(401).json({ message: 'Gagal login' });
        }
    });
});

router.post('/register', (req, res) => {
    const { email, password, gender, role } = req.body;

    // Cek apakah email sudah terdaftar
    pool.query('SELECT MAX(id) AS max_id FROM users', (error, results) => {
        if (error) {
            throw error;
        }

        const maxId = results.rows[0].max_id || 0;
        const newId = maxId + 1;

        // Jika email belum terdaftar, tambahkan pengguna baru dengan id baru
        pool.query(
            'INSERT INTO users (id, email, password, gender, role) VALUES ($1, $2, $3, $4, $5)',
            [newId, email, password, gender, role],
            (error, results) => {
                if (error) {
                    throw error;
                }

                // Buat token otentikasi untuk pengguna yang baru mendaftar
                const user = {
                    email: email,
                    id: newId
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