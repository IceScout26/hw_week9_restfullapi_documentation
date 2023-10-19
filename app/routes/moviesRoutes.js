const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');
const { authorize } = require('./authRoutes');

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Endpoints to manage movies
 */

router.use(authorize);

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */

router.get('/', moviesController.getMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve a movie by its ID.
 *     tags: [Movies]
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
 */

router.get('/:id', moviesController.getMovieById);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Add a new movie
 *     description: Add a new movie to the list.
 *     tags: [Movies]
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
 */

router.post('/', moviesController.addMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     description: Update a movie's details by its ID.
 *     tags: [Movies]
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
 */

router.put('/:id', moviesController.updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     description: Delete a movie by its ID.
 *     tags: [Movies]
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

router.delete('/:id', moviesController.deleteMovie);

module.exports = router;
