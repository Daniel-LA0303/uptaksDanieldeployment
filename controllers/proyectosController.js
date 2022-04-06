const Proyectos = require('../models/Proyecto');
const Tareas = require('../models/Tareas');


exports.proyectosHome = async (req, res) => {

    //consultando a la db
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {usuarioId: usuarioId} //Mostrando los proyectos solo del usuario autenticado
    });
    

    res.render('index', {
        nombrePagina: 'Proyectos ',
        proyectos //pasando a la vista los datos de la db
    });
}
exports.proyectosFormularioProyecto = async (req, res) => {

    //consultando a la db
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {usuarioId: usuarioId} //Mostrando los proyectos solo del usuario autenticado
    });

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}
exports.nuevoProyecto = async (req, res) => {
    //Enviando a la consola lo que se escriba
    // console.log(req.body);
    //consultando a la db
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {usuarioId: usuarioId} //Mostrando los proyectos solo del usuario autenticado
    });
    
    //Validar que tengamos algo en el input
    const {nombre} = req.body;
    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al proyecto'});
    }

    //Si hay errores 
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //No hay errores
        //Insertar en la db ----

        // const url = slug(nombre).toLowerCase(); //generando una url para cada proyecto con slug

        const usuarioId = res.locals.usuario.id; //alamacenar el usuario que creo el proyecto
        await Proyectos.create({nombre, usuarioId}); 
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    //consultando a la db
    //consultando a la db
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({
        where: {usuarioId: usuarioId} //Mostrando los proyectos solo del usuario autenticado
    });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId :usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]); //Consultando la db por medio de promise

    //Consultar tareas de proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoID : proyecto.id
        }
    });

    if(!proyecto) return next();

    //render a la vista 
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

//ruta hacia editar
exports.formularioEditar = async (req, res) => {
    
    //consultando a la db
    const usuarioId = res.locals.usuario.id;
    const proyectosPromises = Proyectos.findAll({
        where: {usuarioId: usuarioId} //Mostrando los proyectos solo del usuario autenticado
    });
    
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId: usuarioId
        },
        // include: [
        //     { model: Proyectos}
        // ]
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);//Consultando la db por medio de promise

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}
//actualizando la db despues de dar click en guargar (editando)
exports.actualizarProyecto = async (req, res) => {
    //Enviando a la consola lo que se escriba
    // console.log(req.body);
    //consultando a la db
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {usuarioId: usuarioId} //Mostrando los proyectos solo del usuario autenticado
    });
    
    //Validar que tengamos algo en el input
    const {nombre} = req.body;
    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al proyecto'});
    }

    //Si hay errores 
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //No hay errores
        //Insertar en la db ----

        // const url = slug(nombre).toLowerCase(); //generando una url para cada proyecto con slug

        await Proyectos.update(
            {nombre : nombre}, //con update ya estara siendo actualizado
            {where : {id: req.params.id}}
        ); 
        res.redirect('/');
    }
}

//creando controller cuando elimina el proyecto
exports.eliminarProyecto = async(req, res, next) => {
    const {urlProyecto} = req.query;
    console.log(urlProyecto);
    const resultado = await Proyectos.destroy(
        {
            where: {url: urlProyecto}
        }
    )

    //posibles errores
    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto eliminado correctanmete')
}


