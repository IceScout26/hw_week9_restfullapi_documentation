// moviesModel.js
const pool = require('../../config/queries');

function getAllMovies(callback) {
    const query = 'SELECT * FROM movies';
    pool.query(query, callback);
}

function getMovieById(movieId, callback) {
    const query = 'SELECT * FROM movies WHERE id = $1';
    pool.query(query, [movieId], callback);
}

function addMovie(newMovie, callback) {
    const { title, genres, year } = newMovie;
    const query = 'INSERT INTO movies (title, genres, year) VALUES ($1, $2, $3)';
    pool.query(query, [title, genres, year], callback);
}

function updateMovie(movieId, updatedMovie, callback) {
    const { title, genres, year } = updatedMovie;
    const query = 'UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4';
    pool.query(query, [title, genres, year, movieId], callback);
}

function deleteMovie(movieId, callback) {
    const query = 'DELETE FROM movies WHERE id = $1';
    pool.query(query, [movieId], callback);
}

function updateMoviePhoto(movieId, photoPath, callback) {
    pool.query(
        'UPDATE movies SET photo = $1 WHERE id = $2',
        [photoPath, movieId],
        (error, results) => {
            if (error) {
                callback(error);
            } else {
                callback(null, results);
            }
        }
    );
}

module.exports = {
    getAllMovies, // Ubah dari getMovies menjadi getAllMovies
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
    updateMoviePhoto,
};
