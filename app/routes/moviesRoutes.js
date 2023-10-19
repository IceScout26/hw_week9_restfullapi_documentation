const express = require('express');
const router = express.Router();
const pool = require('../../config/queries');
const { authorize } = require('./authRoutes');

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         genres:
 *           type: string
 *         year:
 *           type: integer
 *
 *     MovieInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         genres:
 *           type: string
 *         year:
 *           type: integer
 *
 * /movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page (default is 10).
 *     responses:
 *       200:
 *         description: A list of movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *
 *   post:
 *     summary: Add a new movie
 *     description: Add a new movie to the list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *     responses:
 *       200:
 *         description: Movie added successfully.
 *
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve a movie by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: A movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *
 *   put:
 *     summary: Update a movie by ID
 *     description: Update a movie's details by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *     responses:
 *       200:
 *         description: Movie updated successfully.
 *
 *   delete:
 *     summary: Delete a movie by ID
 *     description: Delete a movie by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 */
router.use(authorize); // Middleware untuk otentikasi

router.get('/', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    pool.query('SELECT * FROM movies OFFSET $1 LIMIT $2', [offset, limit], (error, results) => {
        if (error) {
            throw error;
        }
        res.json(results.rows);
    });
});

router.get('/:id', (req, res) => {
    const movieId = req.params.id;
    pool.query('SELECT * FROM movies WHERE id = $1', [movieId], (error, results) => {
        if (error) {
            throw error;
        }
        res.json(results.rows[0]);
    });
});

router.post('/', (req, res) => {
    const { title, genres, year } = req.body;
    pool.query('SELECT MAX(id) FROM movies', (error, results) => {
        if (error) {
            throw error;
        }
        const newId = results.rows[0].max + 1;
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

router.put('/:id', (req, res) => {
    const movieId = req.params.id;
    const { title, genres, year } = req.body;
    pool.query('UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4', [title, genres, year, movieId], (error, results) => {
        if (error) {
            throw error;
        }
        res.json({
            message: 'Data movie berhasil diupdate'
        });
    });
});

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
