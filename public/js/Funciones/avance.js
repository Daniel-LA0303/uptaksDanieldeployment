import Swal from "sweetalert2";
export const actulizarAvance = () => {
    //seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if(tareas.length){
        //sellecionar tareas 
        const tareasCompletas = document.querySelectorAll('i.completo');

        //calcular avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);


        //Mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if(avance === 100){
            Swal.fire(
                'Tarea completada',
                'Felicidades, proyecto finalizado',
                'success'
            )
        }
    }    
}