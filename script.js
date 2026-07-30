// =====================================
// URL DE APPS SCRIPT
// =====================================

const URL_SCRIPT =
"https://script.google.com/macros/s/AKfycbyEXYlYwocDHglnBZsyTRqtXT2Nvi7C-NM1gPr9PfaBn3uGnItyE8nzfr_wJ41kGLo/exec";

let productos = [];

// =====================================
// INICIO
// =====================================

document.addEventListener(
"DOMContentLoaded",
() => {


    cargarProductos();

  document
    .getElementById("buscar")
    .addEventListener(
        "input",
        filtrarProductos
    );

    const formulario =
        document.getElementById("formProducto");

    formulario.addEventListener(
        "submit",
        guardarProducto
    );

}


);

// =====================================
// GUARDAR PRODUCTO
// =====================================

function guardarProducto(e){


e.preventDefault();

const modelo =
    document.getElementById("modelo").value;

const capacidad =
    document.getElementById("capacidad").value;

const color =
    document.getElementById("color").value;

const bateria =
    document.getElementById("bateria").value;

const estado =
    document.getElementById("estado").value;

const precio =
    document.getElementById("precio").value;

const url =
    `${URL_SCRIPT}?action=guardar&modelo=${encodeURIComponent(modelo)}&capacidad=${encodeURIComponent(capacidad)}&color=${encodeURIComponent(color)}&bateria=${encodeURIComponent(bateria)}&estado=${encodeURIComponent(estado)}&precio=${encodeURIComponent(precio)}`;

fetch(url)
    .then(res => res.text())
    .then(data => {

        alert("Equipo guardado correctamente");

        document
            .getElementById("formProducto")
            .reset();

        cargarProductos();

    })
    .catch(error => {

        console.error(error);

        alert("Error al guardar");

    });


}

// =====================================
// CARGAR PRODUCTOS
// =====================================

function cargarProductos(){


fetch(
    `${URL_SCRIPT}?action=listar`
)
.then(res => res.json())
.then(datos => {

    productos = datos;

    const activos = datos.filter(
    producto => producto[5] !== "Vendido"
    );

    document.getElementById(
    "totalEquipos"
    ).textContent = activos.length;

    const valorTotal = activos.reduce(
        (acumulador, producto) =>
            acumulador + Number(producto[6]),
        0
    );

    document.getElementById(
        "valorInventario"
    ).textContent =
        "$" + valorTotal.toLocaleString("es-AR");

    const tbody =
        document.querySelector(
            "#tablaProductos tbody"
        );

    tbody.innerHTML = "";

    
    activos.forEach(producto => {

        tbody.innerHTML += `
            <tr>

                <td>${producto[0]}</td>

                <td>${producto[1]}</td>

                <td>${producto[2]}</td>

                <td>${producto[3]}</td>

                <td>${producto[4]}%</td>

                <td>${producto[5]}</td>

                <td>
                    $${Number(
                        producto[6]
                    ).toLocaleString("es-AR")}
                </td>

                <td>
                    ${new Date(producto[7]).toLocaleDateString("es-AR")}
                </td>

                <td>
                   <button onclick="venderProducto(${producto[0]})">
                     Vender
                   </button>
                </td>

            </tr>
        `;

    });

})
.catch(error => {

    console.error(
        "Error al cargar productos:",
        error
    );

});

}

function filtrarProductos() {

    const texto =
        document
            .getElementById("buscar")
            .value
            .toLowerCase();

    const tbody =
        document.querySelector(
            "#tablaProductos tbody"
        );

    tbody.innerHTML = "";

    const filtrados =
        productos.filter(producto =>
            producto[5] !== "Vendido" &&
            producto[1]
                .toLowerCase()
                .includes(texto)
        );

    document.getElementById(
    "totalEquipos"
    ).textContent = filtrados.length;

    const valorFiltrado = filtrados.reduce(
    (acumulador, producto) =>
        acumulador + Number(producto[6]),
    0
    );

    document.getElementById(
       "valorInventario"
    ).textContent =
       "$" + valorFiltrado.toLocaleString("es-AR");

    
    
    filtrados.forEach(producto => {

        tbody.innerHTML += `
            <tr>

                <td>${producto[0]}</td>

                <td>${producto[1]}</td>

                <td>${producto[2]}</td>

                <td>${producto[3]}</td>

                <td>${producto[4]}%</td>

                <td>${producto[5]}</td>

                <td>
                    $${Number(producto[6])
                        .toLocaleString("es-AR")}
                </td>

                <td>
                    ${new Date(producto[7])
                        .toLocaleDateString("es-AR")}
                </td>

                 <td>
                    <button onclick="venderProducto(${producto[0]})">
                       Vender
                    </button>
                </td>

                
            </tr>
        `;

    });

}

function venderProducto(id){

    if(!confirm("¿Marcar este equipo como vendido?")){
        return;
    }

    fetch(
        `${URL_SCRIPT}?action=vender&id=${id}`
    )
    .then(res => res.text())
    .then(data => {

        alert("Equipo vendido");

        cargarProductos();

    })
    .catch(error => {

        console.error(error);

        alert("Error al actualizar");

    });

}


