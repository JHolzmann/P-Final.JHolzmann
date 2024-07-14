let precios = {};
let profesores = {};
let fechasDisponibles = [];

// Función para cargar datos desde data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        precios = data.precios;
        profesores = data.profesores;
        fechasDisponibles = data.fechasDisponibles;
        // Llenar los selectores con los datos obtenidos
        llenarSelectores();
    })
    .catch(error => console.error('Error al cargar los datos:', error));

// Función para llenar los selectores con datos
function llenarSelectores() {
    const diasSelect = document.getElementById('dias');
    const horarioSelect = document.getElementById('horario');
    const fechaInicioSelect = document.getElementById('fechaInicio');

    diasSelect.innerHTML = '<option value="">Seleccione</option>';
    for (const dia in precios) {
        const option = document.createElement('option');
        option.value = dia;
        option.textContent = `${dia} días ($${precios[dia]})`;
        diasSelect.appendChild(option);
    }

    horarioSelect.innerHTML = '<option value="">Seleccione</option>';
    for (const horario in profesores) {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = `${horario} - ${profesores[horario]}`;
        horarioSelect.appendChild(option);
    }

    fechaInicioSelect.innerHTML = '<option value="">Seleccione</option>';
    fechasDisponibles.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        fechaInicioSelect.appendChild(option);
    });
}

// Función para calcular el costo total según los días seleccionados
function calcularCosto(dias) {
    return precios[dias] || 0;
}

// Función para mostrar el resumen de la inscripción
function mostrarResumen({ nombreApellido, dias, horario, fechaInicio, costoTotal }) {
    const resumen = `
        <h4>Resumen de Inscripción:</h4>
        <p><strong>Nombre:</strong> ${nombreApellido}</p>
        <p><strong>Días a la semana:</strong> ${dias}</p>
        <p><strong>Horario:</strong> ${horario}</p>
        <p><strong>Fecha de inicio:</strong> ${fechaInicio}</p>
        <p><strong>Costo total:</strong> $${costoTotal}</p>`;
    
    const respuestaDiv = document.getElementById('respuesta');
    respuestaDiv.innerHTML = resumen;
    respuestaDiv.style.display = 'block';
}

// Función para guardar la membresía en localStorage
function guardarMembresiaEnLocalStorage(membresia) {
    const membresiaJSON = JSON.stringify(membresia);
    localStorage.setItem('membresia', membresiaJSON);
}

// Función para obtener la membresía guardada desde localStorage
function obtenerMembresiaDeLocalStorage() {
    const membresiaJSON = localStorage.getItem('membresia');
    return membresiaJSON ? JSON.parse(membresiaJSON) : null;
}

// Función para obtener los valores del formulario
function obtenerValoresFormulario() {
    const nombreApellido = document.getElementById('nombreApellido').value;
    const dias = document.getElementById('dias').value;
    const horarioSeleccionado = document.getElementById('horario').value;
    const horario = `${horarioSeleccionado} - ${profesores[horarioSeleccionado]}`;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const costoTotal = calcularCosto(dias);

    return { nombreApellido, dias, horario, fechaInicio, costoTotal };
}

// Función para limpiar el formulario y el div de respuesta
function limpiarFormularioYRespuesta() {
    document.getElementById('formularioInscripcion').reset();
    const respuestaDiv = document.getElementById('respuesta');
    respuestaDiv.innerHTML = '';
    respuestaDiv.style.display = 'none';
}

// Evento al enviar el formulario de inscripción
document.getElementById('formularioInscripcion').addEventListener('submit', function(event) {
    event.preventDefault();

    const valoresFormulario = obtenerValoresFormulario();
    guardarMembresiaEnLocalStorage(valoresFormulario); // Guardar solo los valores del formulario

    mostrarResumen(valoresFormulario);

    // Mostrar SweetAlert
    Swal.fire({
        title: 'Inscripción Exitosa',
        html: `<p>${valoresFormulario.nombreApellido}, tu inscripción ha sido realizada con éxito.</p>`,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            limpiarFormularioYRespuesta();  // Limpiar el formulario y el div de respuesta al hacer clic en OK
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Limpiar membresía guardada en localStorage al cargar la página
    localStorage.removeItem('membresia');

    // Llenar selectores y mostrar resumen si hay membresía guardada
    const membresiaGuardada = obtenerMembresiaDeLocalStorage();
    if (membresiaGuardada) {
        document.getElementById('nombreApellido').value = membresiaGuardada.nombreApellido;
        document.getElementById('dias').value = membresiaGuardada.dias;
        const horarioSeleccionado = membresiaGuardada.horario.split(' - ')[0];
        document.getElementById('horario').value = horarioSeleccionado;
        document.getElementById('fechaInicio').value = membresiaGuardada.fechaInicio;
        
        mostrarResumen(membresiaGuardada);
    } else {
        // Limpiar formulario y respuesta si no hay membresía guardada
        limpiarFormularioYRespuesta();
    }
});