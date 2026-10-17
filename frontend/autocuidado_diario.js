//--------------------------------------//
//--|funcionalidad_autocuidado_diario|--//
//--------------------------------------//
const CLAVE = "autocuidadoDiario";
const hoy = () => new Date().toLocaleDateString("en-CA");
let estado = {
    fecha: hoy(),
    hechos: [],
    nota: ""
};
const tarjetas = document.querySelectorAll(".consejo");
const zona = document.getElementById("consejos");
const fecha = document.getElementById("fecha");
const relleno = document.getElementById("relleno");
const contador = document.getElementById("contador");
const animo = document.getElementById("animo");
const nota = document.getElementById("nota");
//-----------------------------------//
//--|guardar_datos_en_el_navegador|--//
//-----------------------------------//
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
function cargar() {
    const datos = localStorage.getItem(CLAVE);
    if (datos) {
        estado = {
            ...estado,
            ...JSON.parse(datos)
        };
    }
    if (estado.fecha !== hoy()) {
        estado.fecha = hoy();
        estado.hechos = [];
    }
}
//---------------------------------//
//--|actualizar_fecha_y_progreso|--//
//---------------------------------//
function actualizar() {
    fecha.textContent = new Date().toLocaleDateString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
    tarjetas.forEach(function(tarjeta) {
        const hecho = estado.hechos.includes(tarjeta.dataset.id);
        tarjeta.classList.toggle("hecho", hecho);
        tarjeta.querySelector(".check").checked = hecho;
    });
    const cantidad = estado.hechos.length;
    relleno.style.width = (cantidad / tarjetas.length) * 100 + "%";
    contador.textContent =
        `${cantidad} de ${tarjetas.length} consejos cumplidos`;
    if (cantidad === tarjetas.length) {
        animo.textContent = "🎉 ¡Cuidaste de ti hoy, excelente!";
    } else if (cantidad === 0) {
        animo.textContent = "Empieza con un pequeño paso.";
    } else {
        animo.textContent = "💪 ¡Vas muy bien, sigue así!";
    }
    nota.value = estado.nota;
}
//-----------------------------//
//--|eventos_de_las_casillas|--//
//-----------------------------//
zona.addEventListener("change", function(evento) {
    const tarjeta = evento.target.closest(".consejo");
    if (!tarjeta || !evento.target.matches(".check")) {
        return;
    }
    const id = tarjeta.dataset.id;
    if (evento.target.checked) {
        if (!estado.hechos.includes(id)) {
            estado.hechos.push(id);
        }
    } else {
        estado.hechos = estado.hechos.filter(function(h) {
            return h !== id;
        });
    }
    guardar();
    actualizar();
});
//---------------------------//
//--|guardar_nota_personal|--//
//---------------------------//
nota.addEventListener("input", function() {
    estado.nota = nota.value;
    guardar();
});
//--------------------------------//
//--|reiniciar_consejos_del_dia|--//
//--------------------------------//
document.getElementById("btn-reiniciar").addEventListener(
    "click",
    function() {
        estado.hechos = [];
        guardar();
        actualizar();
    }
);
//---------------------------//
//--|iniciar_la_aplicacion|--//
//---------------------------//
cargar();
actualizar();