const nombreElement = document.getElementById('nombre');
const apellidoElement = document.getElementById('apellido');
const emailElement = document.getElementById('email');
const editarBtn = document.getElementById('editarBtn');
const guardarBtn = document.getElementById('guardarBtn');
const eliminarBtn = document.getElementById('eliminarBtn');
const btn_eliminar_cuenta = document.getElementById("btn_eliminar_cuenta");

let modoEdicion = false;

window.addEventListener("load", () => {
    cargarDatosDesdeAPI();
});

editarBtn.addEventListener('click', () => {
    habilitarEdicion();
});

guardarBtn.addEventListener('click', () => {
    guardarCambios();
});

btn_eliminar_cuenta.addEventListener('click', () => {
    if (window.confirm("Esta seguro de eliminar su cuenta?")) {
        eliminarcuenta();
      }}
);

let id = 0;

async function cargarDatosDesdeAPI() {
    try {
        const response = await fetch('https://api-finanzas-deploy.onrender.com/datos_cuenta');
        const data = await response.json();
        
            data.forEach((entry) => {
                
                nombreElement.value   = entry.name; 
                apellidoElement.value = entry.lastname;
                emailElement.value    = entry.email; 

           id = entry.id;        
          });
                
        } catch (error) {

        console.error('Error al cargar los datos:', error);
    }
};

function habilitarEdicion() {
    modoEdicion = true;
    document.getElementById('editarBtn').style.display = 'none';
    document.getElementById('guardarBtn').style.display = 'inline-block';

    nombreElement.classList.remove('nombre');
    apellidoElement.classList.remove('apellido');
    emailElement.classList.remove('email');

    nombreElement.removeAttribute('readonly');
    apellidoElement.removeAttribute('readonly');
    emailElement.removeAttribute('readonly');
};

async function guardarCambios() {
    modoEdicion = false;

    document.getElementById('editarBtn').style.display = 'inline-block';
    document.getElementById('guardarBtn').style.display = 'none';

    nombreElement.classList.add('nombre');
    apellidoElement.classList.add('apellido');
    emailElement.classList.add('email');

    nombreElement.setAttribute('readonly', true);
    apellidoElement.setAttribute('readonly', true);
    emailElement.setAttribute('readonly', true);

    const nuevoNombre    =  nombreElement.value;
    const nuevoApellido  =  apellidoElement.value;
    const nuevoEmail     =  emailElement.value;
    try {
      
        await fetch(`https://api-finanzas-deploy.onrender.com/actualizar_user/${id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nuevoNombre, lastname: nuevoApellido, email: nuevoEmail }),
        });
    
        cargarDatosDesdeAPI();
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
    }
};
 
// Cerrar sesion

document.getElementById('cerrarSesionBtn').addEventListener('click', function() {
    fetch('https://api-finanzas-deploy.onrender.com/cerrar_sesion', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.status === 200) {
          
        window.location.replace("http://localhost:5500/index.html");

        } else if (response.status === 401) {        } else {
            console.error('Error al cerrar sesión');
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
});  

// Eliminar cuenta

let button_mas_cuen = document.getElementById("button_mas_cuen");

button_mas_cuen.addEventListener('click', () => {
    btn_eliminar_cuenta.style.display = 'flex';
});

async function eliminarcuenta() {
    try {
      const response = await fetch(`https://api-finanzas-deploy.onrender.com/eliminar_cuenta/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar los datos.');
      }
      window.location.replace("https://front-end-controla-tus-finanzas.onrender.com/index.html");
      tbody.removeChild(row);
    } catch (error) {
      console.error('Error:', error);
    }
  };
