import proyectos from './modulos/proyectos';

import tareas from './modulos/tareas';
import avance, { actulizarAvance } from './Funciones/avance'

//mostarndo el avance
document.addEventListener('DOMContentLoaded', () => {
    actulizarAvance();
})