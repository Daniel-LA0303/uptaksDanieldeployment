const Proyectos = require('../models/Proyecto');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    //Obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {url : req.params.url} //consultando por url
    });

    //leer el valor del input
    const {tarea} = req.body;

    //estado 0 = incompleto y ID del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;


    //Inserar en db
    const resultado = await Tareas.create({tarea,  estado, proyectoId});

    //evitando errores
    if(!resultado){
        return next();
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

//cambia el estado de la tarea
exports.cambiarEstadoTarea = async(req, res) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where: {id: id}
    })

    //cambiar estado
    let estado = 0;
    if(tarea.estado === estado){ //presiono para completarla
        estado =1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();
    if(!resultado){
        return next(); //evitando errores
    }

    res.status(200).send('Actualizado');
}

//eliminar tarea
exports.eliminarTarea = async(req, res, next) => {
   
   const {id} = req.params;
   
   //eliminar la tarea
   const resultado = await Tareas.destroy({where: {id: id}});

   //evitando errore
    if(!resultado){
        return next(); //evitando errores
    }

    res.status(200).send('Tarea eliminada');
    
}