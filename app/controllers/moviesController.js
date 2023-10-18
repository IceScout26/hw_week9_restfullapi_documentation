const pool = require('../models/moviesModel');

// Controller functions for movies
const getMovies = (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;

    pool.getMovies(offset, limit, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(results);
        }
    });
};

const getMovieById = (req, res) => {
    const movieId = req.params.id;

    pool.getMovieById(movieId, (error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'Movie not found' });
            }
        }
    });
};

const addMovie = (req, res) => {
    const { title, genres, year } = req.body;

    pool.getMaxMovieId((error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            const newId = (result.max || 0) + 1;

            pool.addMovie(newId, title, genres, year, (error) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.json({ message: 'New movie data added with ID ' + newId });
                }
            });
        }
    });
};

const updateMovie = (req, res) => {
    const movieId = req.params.id;
    const { title, genres, year } = req.body;

    pool.updateMovie(movieId, title, genres, year, (error) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json({ message: 'Movie data updated' });
        }
    });
};

const deleteMovie = (req, res) => {
    const movieId = req.params.id;

    pool.deleteMovie(movieId, (error) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json({ message: 'Movie data deleted' });
        }
    });
};

module.exports = {
    getMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
};
