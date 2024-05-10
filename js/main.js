const movementListIngresos = document.getElementById('movements')
const movementListEgresos = document.getElementById('movements2')
const userSelect = document.getElementById('user-select')
const movementSection = document.getElementById('movement-section')

let usuarios = []
let userId = null

function obtenerGastos(userId) {
    let gastos = []
    let gastosString = localStorage.getItem(userId);
    if (gastosString != null) {
        gastos = JSON.parse(gastosString)
    }
    return gastos
}

function guardarGasto(userId, gasto) {
    let gastosActuales = obtenerGastos(userId)

    const gastoMismoNombre = gastosActuales.find(gastoActual => gastoActual.name === gasto.name)

    if (gastoMismoNombre == null) {
        gastosActuales.push(gasto)
        localStorage.setItem(userId, JSON.stringify(gastosActuales))
    } else {
        alert("El gasto " + gasto.name + " ya existe.")
    }
}

function listMovement() {
    const gasto = {
        name: document.getElementById('movement-name').value,
        value: document.getElementById('movement-amount').value,
        type: document.getElementById('movement-type').value
    }

    guardarGasto(userId, gasto)
    listarGastos(userId)
}

function limpiarListaGastos() {
    movementListIngresos.innerHTML = ''
    movementListEgresos.innerHTML = ''

}

function listarGastos(userId) {

    try {
        limpiarListaGastos()
        // Obtiene los gastos del usuario desde el local storage
        const gastosUsuario = obtenerGastos(userId)

        const ingresos = gastosUsuario.filter(gasto => gasto.type === 'ingreso')
        const egresos = gastosUsuario.filter(gasto => gasto.type === 'egreso')

        // Mostrar los gastos en la interfaz de usuario
        ingresos.forEach(gasto => {
            // Crear elemento de lista para el gasto
            const movementItemIngreso = document.createElement('li');
            movementItemIngreso.textContent = `Gasto: ${gasto.name} - $${gasto.value}`;
            movementListIngresos.appendChild(movementItemIngreso);
        
            // Crear botón para eliminar
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = `Eliminar`;
            movementItemIngreso.appendChild(botonEliminar); // Añadir el botón como hijo del elemento de lista, no directamente a la lista
        
            // Añadir evento de clic al botón de eliminación
            botonEliminar.addEventListener('click', function() {
                // Eliminar el gasto del array de ingresos
                const index = ingresos.indexOf(gasto);
                if (index !== -1) {
                    ingresos.splice(index, 1); // Eliminar el gasto del array de ingresos
                }
        
                // Eliminar el elemento de lista correspondiente
                movementListIngresos.removeChild(movementItemIngreso);
            });
        });


        
        egresos.forEach(gasto => {
            const movementItemEgreso = document.createElement('li')
            movementItemEgreso.textContent = `Gasto: ${gasto.name} - $${gasto.value}`
            movementListEgresos.appendChild(movementItemEgreso)
        
            // Botón para eliminar
            const botonEliminar = document.createElement('button')
            botonEliminar.textContent = ` Eliminar `
            movementItemEgreso.appendChild(botonEliminar) // Agrega el botón como hijo del elemento de lista, no directamente a la lista
        
            botonEliminar.addEventListener('click', function() {
                // Eliminar el gasto específico del array de egresos
                const index = egresos.indexOf(gasto);
                if (index !== -1) {
                    egresos.splice(index, 1); // Elimina el elemento de la matriz
                }
        
                // Eliminar el elemento de lista correspondiente
                movementListEgresos.removeChild(movementItemEgreso);
            });
        });

    } catch (error) {
        console.error('Error al cargar los gastos:', error.message)
    }
}

async function obtenerUsuarios() {

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) {
            console.error('Ocurrió un error al obtener los usuarios.')
        }

        usuarios = await response.json()
        usuarios.forEach(usuario => {
            const option = document.createElement('option')
            option.value = usuario.id
            option.textContent = usuario.name
            userSelect.appendChild(option)
        })

        return usuarios
    } catch (error) {
        console.error('Error:', error.message)
        return [] // Devuelve una matriz vacía en caso de error
    }
}

// Obtener los usuarios al cargar la página
document.addEventListener('DOMContentLoaded', async function () {

    await obtenerUsuarios()

    userSelect.addEventListener('change', async function () {

        userId = parseInt(userSelect.value)

        if (isNaN(userId)) return

        // Ocultar la sección de movimientos mientras se cargan los datos

        const selectedUser = usuarios.find(usuario => usuario.id === userId)

        if (selectedUser) {
            // Mostrar la sección de movimientos antes de cargar los datos
            movementSection.style.display = 'block'
            // Cargar los gastos del usuario seleccionado
            listarGastos(userId)
        } else {
            alert('Usuario no encontrado')
        }

    })
})