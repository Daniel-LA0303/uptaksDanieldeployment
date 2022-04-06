const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos autenticar
const Usuarios =  require('../models/Usuarios');

//local startegy - Login con credenciales porpios (user and password)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y un password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1
                    } //busca el email 
                })
                //el usuario existe pero el password es incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }
                //email existey el password es correcto
                return done(null, usuario)
            } catch (error) {
                //el usaurio no existe
                return done(null, false, {
                    message: 'Esa cuenta no exite'
                })
            }
        }
    )
);

//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario)
});

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
});

//exportar
module.exports = passport;