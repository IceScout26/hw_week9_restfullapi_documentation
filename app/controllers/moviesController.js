// moviesController.js
const moviesModel = require('../models/moviesModel');

function getMovies(req, res) {
    moviesModel.getAllMovies((error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(results.rows);
        }
    });
}

function getMovieById(req, res) {
    const movieId = req.params.id;
    moviesModel.getMovieById(movieId, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(results.rows[0]);
        }
    });
}

function addMovie(req, res) {
    const newMovie = req.body;
    moviesModel.addMovie(newMovie, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json({
                message: 'Data movie baru berhasil ditambahkan dengan ID ' + results.rows[0].id
            });
        }
    });
}

function updateMovie(req, res) {
    const movieId = req.params.id;
    const updatedMovie = req.body;
    moviesModel.updateMovie(movieId, updatedMovie, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json({
                message: 'Data movie berhasil diupdate'
            });
        }
    });
}

function deleteMovie(req, res) {
    const movieId = req.params.id;
    moviesModel.deleteMovie(movieId, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json({
                message: 'Data movie berhasil dihapus'
            });
        }
    });
}

module.exports = {
    getMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
};