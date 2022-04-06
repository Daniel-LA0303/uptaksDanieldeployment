const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyecto');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER
});
Tareas.belongsTo(Proyectos); //a tarea pertenece a un proyecto

module.exports = Tareas;