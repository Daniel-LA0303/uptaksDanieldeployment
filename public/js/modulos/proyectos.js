import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl; //acceder al atributo personalizado

        // console.log(urlProyecto);

        Swal.fire({
            title: 'Deseas eliminar este proyecto',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              //Peticion a axios
              const url = `${location.origin}/proyectos/${urlProyecto}`
              axios.delete(url, {params: {urlProyecto}})
                .then(function(res) {
                    console.log(res);
                    Swal.fire(
                        'Eliminado!',
                        res.data,
                        'success'
                      );
            
                      // redireccionar al inicio
                      setTimeout(() => {
                        window.location.href = '/';
                      }, 3000)
                })
                .catch(() => { //Cuando hay posibles errores
                    Swal.fire({
                        type: 'error',
                        title:'Hubo un error desconocido',
                        text: 'No se pudo eliminar el proyecto'
                    })
                })
            }
          })
    })
}

export default btnEliminar;
