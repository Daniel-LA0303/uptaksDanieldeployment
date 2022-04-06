const Usuarios =  require('../models/Usuarios');

const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    })
}

exports.formIniciarSesion = (req, res) => {
    //mostrando mensajes de error
    const {error} = res.locals.mensajes;

    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en Uptask',
        error: error
    })
}


exports.crearCuenta = async (req, res) => {
    //leer los datos
    const {email, password} = req.body;

    //Mostrar alerta con flash
    try {

        //crea el usuario
        await Usuarios.create({
            email, 
            password
        })

        //crear una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el oobjeto de usuario
        const usuario = {
            email
        }
        //enviar el emial
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta Uptask',
            confirmarUrl,
            archivo : 'confirmarCuenta'
        });
    

        //reederigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu ceunta');
        res.redirect('/iniciar-sesion')
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message)) //Agregando flash al controller
         res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Craer Cuenta en Uptask',
            //recibira estos valores por si el usuario ya escribio algo
            email: email ,
            password: password

        })
    }
}

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer',{
        nombrePagina: 'reestablecer password'
    })
}

//confirmar cuenta
exports.confirmarCuenta = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    //si no existe el usuario
    if(!usuario){
        req.flash('error',' No valido');
        res.redirect('/crear-cuenta');
    }

    //modificando el valor de activo (cuando ya esta verficada)
    usuario.activo = 1;
    await usuario.save(); ///actualizando

    req.flash('correcto', 'Cuenta creado con exito');
    res.redirect('/iniciar-sesion')


}