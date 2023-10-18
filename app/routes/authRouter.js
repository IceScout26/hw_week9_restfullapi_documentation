const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../models/authModel');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * ... (Dokumentasi Swagger untuk rute login)
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    loginUser(email, password, (error, token) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json({ token });
        }
    });
});

/**
 * @swagger
 * ... (Dokumentasi Swagger untuk rute registrasi)
 */
router.post('/register', (req, res) => {
    const { email, password, gender, role } = req.body;

    registerUser(email, password, gender, role, (error, user) => {
        if (error) {
            res.status(500).json(error);
        } else {
            const token = jwt.sign(user, 'scipio', { expiresIn: '1h' });
            res.json({ message: 'Pendaftaran berhasil', token });
        }
    });
});

/**
 * @swagger
 * ... (Dokumentasi Swagger untuk rute otorisasi)
 */
router.get('/authorize', (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });

    try {
        const decoded = jwt.verify(token, 'scipio');
        req.user = decoded;
        // Implement your authorization logic here
        res.status(200).json({ message: 'User telah diotorisasi' });
    } catch (ex) {
        if (ex instanceof TokenExpiredError) {
            res.status(401).json({ message: 'Token telah kadaluwarsa.' });
        } else {
            res.status(400).json({ message: 'Token tidak valid.' });
        }
    }
});

module.exports = router;