const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local',{ //utilizando metodso de passport
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//FUncion para saber si el usuario esta logeado o no
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado, sigue
    if(req.isAuthenticated()){
        return next();
    }

    //si no esta autenticado, reederigir al formulario
    return res.redirect('/iniciar-sesion');
}


//Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //Añ cerrar sesion nos manda a iniciar sesion
    })
}

//genera un token si el usuario es valido
exports.enviarToken = async(req, res) =>{
    //verificar el usuario exista
    const usuario = await Usuarios.findOne({
        where: {email: req.body.email}
    })

    //si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer')
    }

    // //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    // //expiracion
    usuario.expiracion = Date.now() + 3600000;

    // //guardarlos en db
    await usuario.save();

    // //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    // console.log(resetUrl);
    // res.redirect(`/reestablecer/${usuario.token}`);

    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: ' Password Reset',
        resetUrl,
        archivo : 'reestablecerPassword'
    }) ;

    //cuando ya termino el envio del token

    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

//validando el token y redireccionando a una vista
exports.validarToken = async(req, res) => { //antes resetPassword
    const usuario = await Usuarios.findOne({
        where: {
            token : req.params.token
        }
    });

    console.log(usuario);
    //si no encuentra el usuario
    if(!usuario){
        req.flash('error', 'No valido');//mensaje de error
        res.redirect('/reestablecer');
    }

    //formualrio para generar e password
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer la contraseña'
    })
}

//cambia el password por uno nuevo 
exports.actualizarPassword = async (req, res) => {

    //verifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })

    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //hasheando el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    //guardando nuevos valores
    usuario.token=null;
    usuario.expiracion=null;

    //guardando el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}