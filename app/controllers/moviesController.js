// moviesController.js
const moviesModel = require('../models/moviesModel');
const fs = require('fs');
const path = require('path');

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

function uploadMoviePhoto(req, res) {
    const movieId = req.params.id;
    if (!req.file) {
        return res.status(400).json({
            status: false,
            message: 'No file is selected.'
        });
    }

    const photoPath = req.file.filename;
    const newFileName = movieId + path.extname(req.file.originalname);

    // Gunakan fs.renameSync untuk mengganti nama file
    fs.renameSync(path.join(__dirname, '../views/photos', req.file.filename), path.join(__dirname, '../views/photos', newFileName));

    moviesModel.updateMoviePhoto(movieId, newFileName, (error, results) => {
        if (error) {
            res.status(500).json({
                status: false,
                message: 'Error updating movie photo in the database.'
            });
        } else {
            res.json({
                status: true,
                message: 'Movie photo updated successfully.',
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
    uploadMoviePhoto, // Tambahkan fungsi uploadMoviePhoto
};