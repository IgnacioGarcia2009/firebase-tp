
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYH4A60FNcvkXDdFPeHyvInyBI9GQqfSw",
    authDomain: "cloth-club-e3f70.firebaseapp.com",
    databaseURL: "https://cloth-club-e3f70-default-rtdb.firebaseio.com",
    projectId: "cloth-club-e3f70",
    storageBucket: "cloth-club-e3f70.firebasestorage.app",
    messagingSenderId: "659870016710",
    appId: "1:659870016710:web:fd2169b4174a37b51e23c7",
    measurementId: "G-STXGMCV14F"
};

const aplicacionFirebase = initializeApp(firebaseConfig);

const baseDeDatos = getDatabase(aplicacionFirebase);

const productosRef = ref(baseDeDatos, "productos");

const formularioProducto = document.getElementById("productoForm");

const mensaje = document.getElementById("mensaje");

const listaProductos = document.getElementById("listaProductos");

const busquedaProducto = document.getElementById("busquedaProducto");

const limpiarBusqueda = document.getElementById("limpiarBusqueda");

let productosActuales = [];

formularioProducto.addEventListener("submit", async (evento) => {

    evento.preventDefault();

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

    try {

        await push(productosRef, {

            nombreProducto: nombreProducto,
            categoria: categoria,
            talle: talle,
            color: color,
            precio: precio

        });

        mensaje.textContent =
            "Producto guardado correctamente en Firebase.";

        mensaje.className = "exito";

        formularioProducto.reset();

    } catch (error) {

        console.error("Error al guardar:", error);

        mensaje.textContent =
            "No se pudo guardar el producto.";

        mensaje.className = "error";
    }

});

function agregarCampo(tarjeta, nombreCampo, valor) {

    const parrafo = document.createElement("p");

    const etiqueta = document.createElement("strong");

    etiqueta.textContent = nombreCampo + ": ";

    parrafo.appendChild(etiqueta);

    parrafo.appendChild(
        document.createTextNode(String(valor ?? ""))
    );

    tarjeta.appendChild(parrafo);
}

function mostrarProductos() {

    listaProductos.innerHTML = "";

    const terminoBusqueda = busquedaProducto.value
        .trim()
        .toLowerCase();

    const productosFiltrados = productosActuales.filter(
        (producto) => {

            return String(producto.nombreProducto ?? "")
                .toLowerCase()
                .includes(terminoBusqueda);

        }
    );

    if (productosActuales.length === 0) {

        listaProductos.innerHTML =
            "<p>No hay productos registrados.</p>";

        return;
    }

    if (productosFiltrados.length === 0) {

        listaProductos.innerHTML =
            "<p>No se encontraron productos.</p>";

        return;
    }

    productosFiltrados.forEach((producto) => {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("producto");

        const titulo = document.createElement("h3");

        titulo.textContent = producto.nombreProducto;

        tarjeta.appendChild(titulo);

        agregarCampo(
            tarjeta,
            "ID Firebase",
            producto.idFirebase
        );

        agregarCampo(
            tarjeta,
            "Categoría",
            producto.categoria
        );

        agregarCampo(
            tarjeta,
            "Talle",
            producto.talle
        );

        agregarCampo(
            tarjeta,
            "Color",
            producto.color
        );

        agregarCampo(
            tarjeta,
            "Precio",
            "$" + producto.precio
        );

        listaProductos.appendChild(tarjeta);

    });

}

onValue(productosRef, (snapshot) => {

    const datos = snapshot.val();

    productosActuales = [];

    if (datos) {

        productosActuales = Object.entries(datos).map(
            ([claveFirebase, producto]) => ({

                ...producto,

                idFirebase: claveFirebase

            })
        );

    }

    mostrarProductos();

}, (error) => {

    console.error("Error al consultar Firebase:", error);

    listaProductos.textContent =
        "No se pudieron cargar los productos.";

});

busquedaProducto.addEventListener("input", () => {

    mostrarProductos();

});

limpiarBusqueda.addEventListener("click", () => {

    busquedaProducto.value = "";

    mostrarProductos();

});

