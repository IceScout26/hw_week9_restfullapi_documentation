var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

var movies = require('./routes/movies.js');
var auth = require('./routes/auth.js');

app.use('/movies', movies);
app.use('/auth', auth.router); // Gunakan auth.router di sini
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
