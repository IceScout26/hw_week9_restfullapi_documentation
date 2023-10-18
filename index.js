const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('common'));

const moviesRouter = require('./app/routes/moviesRoutes.js'); // Sesuaikan dengan struktur folder
const authRouter = require('./app/routes/authRoutes.js'); // Sesuaikan dengan struktur folder

app.use('/movies', moviesRouter);
app.use('/auth', authRouter);

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '0.1.0',
            description: 'This is a simple CRUD API application made with Express and documented with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:' + port,
            },
        ],
    },
    apis: ['./app/routes/*.js'], // Sesuaikan dengan struktur folder
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
    console.log('Server berjalan di http://localhost:' + port);
});
