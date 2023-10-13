const express = require('express');
const router = express.Router();
const pool = require('../queries'); // Import file queries.js yang berisi konfigurasi database PostgreSQL
const { authorize } = require('./auth'); // Import middleware otentikasi

// Middleware otentikasi untuk seluruh rute dalam file movies.js (memerlukan otentikasi)
router.use(authorize);

// GET semua data movies
router.get('/', (req, res) => {
    pool.query('SELECT * FROM movies', (error, results) => {
        if (error) {
            throw error;
        }
        res.json(results.rows);
    });
});

// GET data movie berdasarkan ID
router.get('/:id', (req, res) => {
    const movieId = req.params.id;
    pool.query('SELECT * FROM movies WHERE id = $1', [movieId], (error, results) => {
        if (error) {
            throw error;
        }
        res.json(results.rows[0]);
    });
});

// POST data movie baru (memerlukan otentikasi)
router.post('/', (req, res) => {
    const { title, genres, year } = req.body;

    // Ambil ID terakhir dari tabel
    pool.query('SELECT MAX(id) FROM movies', (error, results) => {
        if (error) {
            throw error;
        }

        // Hitung ID baru
        const newId = results.rows[0].max + 1;

        // Masukkan data baru dengan ID baru
        pool.query('INSERT INTO movies (id, title, genres, year) VALUES ($1, $2, $3, $4)', [newId, title, genres, year], (error, results) => {
            if (error) {
                throw error;
            }
            res.json({
                message: 'Data movie baru berhasil ditambahkan dengan ID ' + newId
            });
        });
    });
});

// PUT (update) data movie berdasarkan ID (memerlukan otentikasi)
router.put('/:id', (req, res) => {
    const movieId = req.params.id;
    const {
        title,
        genres,
        year
    } = req.body;
    pool.query('UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4', [title, genres, year, movieId], (error, results) => {
        if (error) {
            throw error;
        }
        res.json({
            message: 'Data movie berhasil diupdate'
        });
    });
});

// DELETE data movie berdasarkan ID (memerlukan otentikasi)
router.delete('/:id', (req, res) => {
    const movieId = req.params.id;
    pool.query('DELETE FROM movies WHERE id = $1', [movieId], (error, results) => {
        if (error) {
            throw error;
        }
        res.json({
            message: 'Data movie berhasil dihapus'
        });
    });
});

module.exports = router;
