import axios from "axios";
import Swal from "sweetalert2";
import { actulizarAvance } from "../Funciones/avance";

// import

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            //extraer
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            // console.log(url);
            // console.log(idTarea);

            axios.patch(url, {idTarea})
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo') //cambiando la clase

                        actulizarAvance();
                    }
                });
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: 'Deseas eliminar este Tarea?',
                text: "Un tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, Cancelar'
              }).then((result) => {
                //Enviar el delte por medio de axios
                if(result.value){
                    const url = `${location.origin}/tareas/${idTarea}`;
                    //enviar el delete por medio de axios
                    axios.delete(url, {params: {idTarea}})
                        .then(function(respuesta){
                            if(respuesta.status === 200){
                                //eliminar el nodo (modificando el js)
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //poner una alert
                                Swal.fire(
                                    'Tarea final',
                                    respuesta.data,
                                    'success'
                                )
                                actulizarAvance();

                            }
                        })
                }
              })
        }
    });

}

export default tareas;