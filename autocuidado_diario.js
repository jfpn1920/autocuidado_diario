// ===== Autocuidado Diario =====
// Clave con la que se guardan los datos en localStorage
const CLAVE = 'autocuidadoDiario';
// Devuelve la fecha de hoy como texto AAAA-MM-DD (para saber si cambió el día)
const hoy = () => new Date().toLocaleDateString('en-CA');
// Estado: día guardado, consejos cumplidos hoy y nota personal
let estado = { fecha: hoy(), hechos: [], nota: '' };
// ===== Referencias a elementos del HTML =====
const tarjetas = document.querySelectorAll('.consejo');   // las 5 tarjetas
const zona = document.getElementById('consejos');         // contenedor de tarjetas
const fecha = document.getElementById('fecha');           // texto de la fecha
const relleno = document.getElementById('relleno');       // relleno de la barra
const contador = document.getElementById('contador');     // texto del contador
const animo = document.getElementById('animo');           // mensaje de ánimo
const nota = document.getElementById('nota');             // área de la nota
// ===== Funciones de localStorage =====
// Guarda el estado actual en el navegador (como texto JSON)
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// Carga el estado guardado; si ya es otro día, desmarca los consejos
function cargar() {
    const datos = localStorage.getItem(CLAVE); // lee el texto guardado
    if (datos) estado = { ...estado, ...JSON.parse(datos) };
    if (estado.fecha !== hoy()) { // si cambió el día, empieza de cero
        estado.fecha = hoy();
        estado.hechos = [];
    }
}
// ===== Funciones de la interfaz =====
// Dibuja en pantalla todo lo que está guardado en el estado
function actualizar() {
    // Escribe la fecha de hoy en español (ej: domingo, 4 de octubre)
    fecha.textContent = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
    // Marca las tarjetas y casillas de los consejos cumplidos
    tarjetas.forEach(tarjeta => {
        const hecho = estado.hechos.includes(tarjeta.dataset.id);
        tarjeta.classList.toggle('hecho', hecho);
        tarjeta.querySelector('.check').checked = hecho;
    });
    // Calcula cuántos consejos se cumplieron y mueve la barra
    const cantidad = estado.hechos.length;
    relleno.style.width = (cantidad / tarjetas.length) * 100 + '%';
    contador.textContent = `${cantidad} de ${tarjetas.length} consejos cumplidos`;
    // Mensaje de ánimo según el avance
    if (cantidad === tarjetas.length) animo.textContent = '🎉 ¡Cuidaste de ti hoy, excelente!';
    else if (cantidad === 0) animo.textContent = 'Empieza con un pequeño paso.';
    else animo.textContent = '💪 ¡Vas muy bien, sigue así!';
    // Escribe la nota guardada en el área de texto
    nota.value = estado.nota;
}
// ===== Eventos =====
// Un solo "oyente" en la zona de consejos detecta cambios en las casillas
zona.addEventListener('change', (evento) => {
    const tarjeta = evento.target.closest('.consejo'); // tarjeta de la casilla
    const id = tarjeta.dataset.id; // identificador del consejo
    if (evento.target.checked) estado.hechos.push(id); // lo agrega a los cumplidos
    else estado.hechos = estado.hechos.filter(h => h !== id); // o lo quita
    guardar();
    actualizar();
});
// Cada vez que se escribe en la nota, se guarda
nota.addEventListener('input', () => {
    estado.nota = nota.value;
    guardar();
});
// Botón "Reiniciar el día": desmarca todos los consejos (la nota se conserva)
document.getElementById('btn-reiniciar').addEventListener('click', () => {
    estado.hechos = [];
    guardar();
    actualizar();
});
// ===== Inicio =====
// Al cargar la página: lee lo guardado y dibuja
cargar();
actualizar();