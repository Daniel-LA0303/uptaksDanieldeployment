const Sequelize = require('sequelize');
const slug = require('slug');
const db = require('../config/db');
const shortid = require('shortid');

//Definir el modelo
const Proyectos = db.define('proyectos', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(100),
    },
    url: {
        type: Sequelize.STRING(100)
    }
}, {
    //nuestros hooks
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase(); //generando una url


            proyecto.url = `${url}-${shortid.generate()}`; //inserteando a la db con un id extra que es unico
        }
}});

module.exports = Proyectos;