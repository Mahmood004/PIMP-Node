const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const Sequelize = require('sequelize');
const routes = require('./routes');
const { port, environment } = require('./config');
const statusCodes = require('./config/statusCodes');

const { INTERNAL_SERVER_ERROR, REQUEST_TOO_LONG } = statusCodes;

let db_config;
if (environment === 'development') {
    db_config =  require('./config/config.json').development;
} else if (environment === 'production') {
    db_config =  require('./config/config.json').production;
}

const sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, {
    host: db_config.host,
    port: db_config.port,
    dialect: db_config.dialect
});

// Included Passport LinkedIn Strategy
require('./services/passport-strategies').linkedin();
// Included Gmail Quickstart
require('./services/gmail/quickstart/index');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({ limits: { fileSize: 50000000 } }).array('docs', 10));
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/api/v1', routes);

app.use('**', (req, res, next) => {
    res.send('<h1>404 Page Not Found</h1>')
});

// Global error handler
app.use((error, req, res, next) => {
    
    if (error instanceof multer.MulterError) {
        
        return res.status(REQUEST_TOO_LONG).send({
            error: true,
            message: `${error.message}: Should not larger than 50MB`,
            stack: `${error.stack}`
        });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({
        error: true,
        message: `${error.name}: ${error.message}`,
        stack: `${error.stack}`
    });
})

app.listen(port, () => {
    console.log(environment);
    console.log(`server is listening on port ${port}`);
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err.name);
        });
});


