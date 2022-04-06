const Sequelize = require('sequelize');

//extraer valores valores.env
// require('dotenv').config({path: });


const db = new Sequelize('uptasknode', 'root', '1234', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: '3306',
    operatorAliases: false,
    define: {
        timestamps: false
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    storage: 'path/to/database.sqlite'
});

module.exports = db;