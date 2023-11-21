const backendURL='http://localhost:7000/administrador/';

// Función para cargar los usuarios al cargar la página
window.onload = function(){
    cargarAdministrador();
};


// Función para obtener el elemento tbody de la tabla
function obtenerTabla() {
    return document.getElementById('adminTable').getElementsByTagName('tbody')[0];
}

// Función para cargar usuarios desde el backend y almacenarlos localmente
function cargarAdministrador() {
    const adminGuardados = JSON.parse(localStorage.getItem('administradores')) || [];

    if (adminGuardados.length > 0) {
        
        adminGuardados.forEach(administrador => agregarFilaATabla(administrador));
    } else {
       
        solicitarAdminAlBackend();
    }
}

function obtenerAdminLocalmente() {
    return JSON.parse(localStorage.getItem('administradores')) || [];
}

function cargarTabla(data) {
    limpiarTabla();
    localStorage.setItem('administradores', JSON.stringify(data));
    data.forEach(administrador => agregarFilaATabla(administrador));
}

function solicitarAdminAlBackend() {
    fetch(backendURL )
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta del servidor no es válida');
            }
            return response.json();
        })
        .then(data => cargarTabla(data))
        .catch(error => console.error('Error en la solicitud:', error));
}

function limpiarTabla() {
    const tabla = obtenerTabla();
    tabla.innerHTML = '';
}

function agregarFilaATabla(administrador) {
    const tabla = obtenerTabla();
    const fila = tabla.insertRow();

    const celdas = [
       
         
        
        administrador.nombre,
        administrador.email,
        administrador.contraseña,
        `<button type="button" onclick="actualizarAdmin('${administrador._id}')">Actualizar</button>
        <button type="button" onclick="eliminarAdmin('${administrador._id}')">Eliminar</button>`
    ];
    
    celdas.forEach((valor, index) => {
        const celda = fila.insertCell(index);
        celda.innerHTML = valor;
    });
}

function crearAdministrador() {
    const nombre = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    const contraseña = document.getElementById('adminPassword').value;

    fetch(backendURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre,email,contraseña }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta del servidor no es válida');
        }
        return response.json();    
    })
    .then(data => {

        agregarFilaATabla(data);

        // Actualizar los datos almacenados localmente
        const guardarAdmin = obtenerAdminLocalmente();
        localStorage.setItem('administradores', JSON.stringify([...guardarAdmin, data]));
    })
    .catch(error => console.error('Error:', error));
}
