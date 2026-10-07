import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "",
    authDomain: ".firebaseapp.com",
    databaseURL: "https://.firebaseio.com",
    projectId: "",
    storageBucket: ".appspot.com",
    messagingSenderId: "",
    appId: ""
};

const aplicacionFirebase = initializeApp(firebaseConfig);

const baseDeDatos = getDatabase(aplicacionFirebase);

const productosRef = ref(baseDeDatos, "productos");


const formularioProducto = document.getElementById("productoForm");
const mensaje = document.getElementById("mensaje");
const listaProductos = document.getElementById("listaProductos");


formularioProducto.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const codigoProducto = document
        .getElementById("codigoProducto")
        .value
        .trim()
        .toUpperCase();

    const nombreProducto = document
        .getElementById("nombreProducto")
        .value
        .trim();

    const categoria = document
        .getElementById("categoria")
        .value;

    const talle = document
        .getElementById("talle")
        .value
        .trim()
        .toUpperCase();

    const color = document
        .getElementById("color")
        .value
        .trim();

    const precio = Number(
        document.getElementById("precio").value
    );

    const productoIndividualRef = ref(
        baseDeDatos,
        "productos/" + codigoProducto
    );


    try {

        await set(productoIndividualRef, {
            nombreProducto: nombreProducto,
            categoria: categoria,
            talle: talle,
            color: color,
            precio: precio
        });


        mensaje.textContent = "Producto guardado correctamente en Firebase.";
        mensaje.style.color = "green"

        formularioProducto.reset();

    } catch (error) {

        console.error("Error al guardar:", error);

        mensaje.textContent =
            "No se pudo guardar el producto.";
        mensaje.style.color = "red";
    }
});

onValue(productosRef, (snapshot) => {

    listaProductos.innerHTML = "";

    const productos = snapshot.val();

    if (!productos) {
        listaProductos.innerHTML =
            "<p>No hay productos registrados.</p>";
        return;
    }

    Object.entries(productos).forEach(
        ([codigoProducto, producto]) => {

            const productoHTML = document.createElement("div");

            productoHTML.classList.add("producto");

            productoHTML.innerHTML = `
                <h3>${producto.nombreProducto}</h3>

                <p>
                    <strong>Código:</strong>
                    ${codigoProducto}
                </p>

                <p>
                    <strong>Categoría:</strong>
                    ${producto.categoria}
                </p>

                <p>
                    <strong>Talle:</strong>
                    ${producto.talle}
                </p>

                <p>
                    <strong>Color:</strong>
                    ${producto.color}
                </p>

                <p>
                    <strong>Precio:</strong>
                    $${producto.precio}
                </p>
            `;

            listaProductos.appendChild(productoHTML);
        }
    );
});
