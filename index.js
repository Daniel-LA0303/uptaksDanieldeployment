const expres = require ('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash =  require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//helpers con algunas funciones
const helpers = require('./helpers');

//Creando la conexion a la db
const db = require('./config/db');
//Importar el modelo
require('./models/Proyecto');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('conexion exitosa'))
    .catch(error => console.error(error))

//Crear una app de express
const app = expres();

//donde cargar los archivos estaticos
app.use(expres.static('public'));

//Habilitar PUG
app.set('view engine', 'pug');

//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//Agregamos espress-avlidator
app.use(expressValidator());

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash()); //para que este en toda

//agregando cookieParser a index.js
app.use(cookieParser());

//sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar vardump a la aplicacion
app.use((req, res, next ) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash(); //haciendo flahs parate de las varieables locales
    res.locals.usuario = {...req.user} || null; //acceder a la info del usuario auth
    next();
});





app.use('/', routes())

//puerto en el ue corre el servidor
app.listen(3000);

