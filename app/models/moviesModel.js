const pool = require('../../config/queries');

// Model functions for movies
const getMovies = (offset, limit, callback) => {
    pool.query('SELECT * FROM movies OFFSET $1 LIMIT $2', [offset, limit], callback);
};

const getMovieById = (movieId, callback) => {
    pool.query('SELECT * FROM movies WHERE id = $1', [movieId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            if (results.rows.length === 1) {
                callback(null, results.rows[0]);
            } else {
                callback(null, null);
            }
        }
    });
};

const getMaxMovieId = (callback) => {
    pool.query('SELECT MAX(id) FROM movies', callback);
};

const addMovie = (id, title, genres, year, callback) => {
    pool.query('INSERT INTO movies (id, title, genres, year) VALUES ($1, $2, $3, $4)', [id, title, genres, year], callback);
};

const updateMovie = (id, title, genres, year, callback) => {
    pool.query('UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4', [title, genres, year, id], callback);
};

const deleteMovie = (id, callback) => {
    pool.query('DELETE FROM movies WHERE id = $1', [id], callback);
};

module.exports = {
    getMovies,
    getMovieById,
    getMaxMovieId,
    addMovie,
    updateMovie,
    deleteMovie,
};
