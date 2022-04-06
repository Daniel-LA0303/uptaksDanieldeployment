//archivo de rutas

const express = require('express');
const router = express.Router();

//importar express validator
const {body} = require('express-validator/check');

//importar el controlador
const proyectosControlle = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {

    //ruta para el home
    router.get('/', 
        authController.usuarioAutenticado, //revisa que el usuario esta autenticado
        proyectosControlle.proyectosHome);
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosControlle.proyectosFormularioProyecto);
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), //Validando
        proyectosControlle.nuevoProyecto); //Metodo post al enviar info

    
    //Listar Proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,    
        proyectosControlle.proyectoPorUrl);

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosControlle.formularioEditar);
    router.post('/nuevo-proyecto/:id', //este post es para la edicion
        body('nombre').not().isEmpty().trim().escape(), //Validando
        proyectosControlle.actualizarProyecto); //Metodo post al enviar info

    //Eliminar proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosControlle.eliminarProyecto);


    //Aqui empieza la seccion de las tareas
    //agrega la tarea
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea);
    //actualizar la tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea)

    //eliminar tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    //confirmando la cuenta
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

    //Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);


    //Cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //Restablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken); //antes resetPassword
    router.post('/reestablecer/:token', authController.actualizarPassword);


    return router;

}

