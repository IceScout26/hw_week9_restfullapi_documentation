const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');
const { authorize } = require('./authRoutes');

/**
 * @swagger
 * ... (Dokumentasi Swagger untuk rute movies)
 */

router.get('/', moviesController.getMovies);
router.get('/:id', moviesController.getMovieById);
router.post('/', authorize, moviesController.addMovie);
router.put('/:id', authorize, moviesController.updateMovie);
router.delete('/:id', authorize, moviesController.deleteMovie);

module.exports = router;
