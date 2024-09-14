const productos = [
    { id: 1, nombre: "Azúcar", priceUSD: 0.9, imagen: "https://www.casa-segal.com/wp-content/uploads/2019/03/azucar-kilo-ledesma-reposteria-mendoza-casa-segal-1-600x600.jpg" },
    { id: 2, nombre: "Yerba", priceUSD: 1.8, imagen: "https://carnesargentinas.es/wp-content/uploads/2020/02/YERBA_MATE-PLAYADITO_500_GR.jpg" },
    { id: 3, nombre: "Fideos", priceUSD: 1.66, imagen: "https://arjosimarprod.vteximg.com.br/arquivos/ids/162602-1000-1000/Fideo-Tallarines-Marolio-500-gr-1-468.jpg?v=637473691914230000" },
    { id: 4, nombre: "Harina", priceUSD: 0.63, imagen: "https://maricre.com.ar/wp-content/uploads/2020/05/120.jpg" },
    { id: 5, nombre: "Aceite", priceUSD: 2.73, imagen: "https://http2.mlstatic.com/D_NQ_NP_612866-MLA70193321731_062023-O.webp" },
    { id: 6, nombre: "Galletitas Saladas", priceUSD: 0.64, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1Fi5dp-22N4HAskclmylgjFAsEaqORj6wnw&s" },
    { id: 7, nombre: "Galletitas Dulces", priceUSD: 0.58, imagen: "https://saborlatinostore.com/wp-content/uploads/2022/10/GALVOC742.jpg" },
    { id: 8, nombre: "Huevos", priceUSD: 5.5, imagen: "https://www.gba.gob.ar/sites/default/files/desarrolloagrario/newsletter/images/huevos.jpg" },
    { id: 9, nombre: "Leche", priceUSD: 1.23, imagen: "https://acdn.mitiendanube.com/stores/093/780/products/serenisima-clasica-751-95fea92d1a27f8e9ab15710914346750-480-0.png" },
    { id: 10, nombre: "Pan", priceUSD: 3.92, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYfzsxUMqb5-ieouWAdSn3OtxgFv2BvABAGg&s" },
    { id: 11, nombre: "Porotos", priceUSD: 3.37, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQal_d7pJJfdaMIozdd_suSTPWlhLMBU8jhkQ&s" },
    { id: 12, nombre: "Puré de Tomate", priceUSD: 0.68, imagen: "https://f2h.shop/media/catalog/product/cache/ab45d104292f1bb63d093e6be8310c97/p/u/pure_de_tomate_1.png" },
    { id: 13, nombre: "Dulce de Leche", priceUSD: 2.21, imagen: "https://f2h.shop/media/catalog/product/cache/ab45d104292f1bb63d093e6be8310c97/d/d/ddl_ls_colonial.jpg" },
    { id: 14, nombre: "Gaseosas", priceUSD: 1.29, imagen: "https://supermercadoseven.com.ar/wp-content/uploads/2024/01/7798113300010-4.jpg" },
    { id: 15, nombre: "Té", priceUSD: 2.51, imagen: "https://http2.mlstatic.com/D_NQ_NP_632776-MLU72700317639_112023-O.webp" },
    { id: 16, nombre: "Mate Cocido", priceUSD: 2.94, imagen: "https://www.lavirginia.com.ar/wp-content/uploads/2021/12/779015260241-02-scaled.jpg" }
];

// No agregué un archivo JSON con los datos de los productos porque mi navegador no me lo permitía, por la política CORS, por lo que nó podía verificar que los datos estuvieran conectados correctamente, ni testear la página. En cambio, empleé una API.

const carritoKey = 'carrito'; 
const carrito = cargarCarrito(); 

async function tipoDeCambioFetch() {
    try {
        const response = await fetch('https://api.bluelytics.com.ar/v2/latest');
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
        const { blue: { value_avg } } = await response.json();
        return value_avg;
    } catch (error) {
        console.error('Error al consultar el tipo de cambio:', error);
        return 1200; 
    }
}

function mostrarProductos(productos, tipoDeCambio) {
    const productosLista = document.getElementById('producto-lista');
    productosLista.innerHTML = productos.map(producto => {
        const precioPesos = (producto.priceUSD * tipoDeCambio).toFixed(2);
        return `
            <div class="producto">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: $${precioPesos} ARS</p>
                    <button data-id="${producto.id}" class="al-carrito">Añadir al Carrito</button>
                </div>
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            </div>
        `;
    }).join('');
}

function cargarCarrito() {
    const carritoDatos = localStorage.getItem(carritoKey);
    return carritoDatos ? JSON.parse(carritoDatos) : [];
}

function guardarCarrito() {
    localStorage.setItem(carritoKey, JSON.stringify(carrito));
}

function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    const total = carrito.reduce((sum, item) => sum + item.precioPesos, 0);
    
    carritoItems.innerHTML = carrito.map(item => `
        <li>
            ${item.nombre} - $${item.precioPesos.toFixed(2)} ARS
            <button data-id="${item.id}" class="remover-del-carrito">Eliminar</button>
        </li>
    `).join('');
    
    carritoTotal.textContent = `Total: $${total.toFixed(2)} ARS`;
    
    document.getElementById('ver-carrito').textContent = 
        document.getElementById('carrito').classList.contains('hidden') ? 
        `Ver Carrito (${carrito.length})` : `Ocultar Carrito (${carrito.length})`;
}

function sumarAlCarrito(producto, tipoDeCambio) {
    const precioPesos = (producto.priceUSD * tipoDeCambio).toFixed(2);
    carrito.push({ ...producto, precioPesos: parseFloat(precioPesos) });
    guardarCarrito();
    mostrarCarrito(tipoDeCambio);
}

function sacarDelCarrito(idProducto) {
    const index = carrito.findIndex(item => item.id === idProducto);
    if (index !== -1) {
        carrito.splice(index, 1);
        guardarCarrito();
        mostrarCarrito();
    }
}

function vaciarCarrito() {
    carrito.length = 0;
    guardarCarrito();
    mostrarCarrito();
}

function mantenerCarritoVisible() {
    const carritoSeccion = document.getElementById('carrito');
    const botonCarritoMostrar = document.getElementById('ver-carrito');
    const oculto = carritoSeccion.classList.toggle('hidden');
    botonCarritoMostrar.textContent = oculto ? `Ver Carrito (${carrito.length})` : `Ocultar Carrito (${carrito.length})`;
}

function anioFooter() {
    document.getElementById('anio-actual').textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", async function () {
    const tipoDeCambio = await tipoDeCambioFetch();
    mostrarProductos(productos, tipoDeCambio);
    mostrarCarrito(tipoDeCambio);
    
    document.getElementById('producto-lista').addEventListener('click', event => {
        if (event.target.classList.contains('al-carrito')) {
            const productoId = parseInt(event.target.getAttribute('data-id'));
            const producto = productos.find(p => p.id === productoId);
            if (producto) sumarAlCarrito(producto, tipoDeCambio);
        }
    });

    document.getElementById('carrito').addEventListener('click', event => {
        if (event.target.classList.contains('remover-del-carrito')) {
            const productoId = parseInt(event.target.getAttribute('data-id'));
            sacarDelCarrito(productoId);
        }
    });

    document.getElementById('ver-carrito').addEventListener('click', mantenerCarritoVisible);

    const botonVaciarCarrito = document.createElement('button');
    botonVaciarCarrito.textContent = 'Vaciar Carrito';
    botonVaciarCarrito.id = 'vaciar-carrito';
    document.getElementById('carrito').appendChild(botonVaciarCarrito);

    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
    anioFooter();

    document.getElementById('buscador-input').addEventListener('input', function () {
        const textoBusqueda = this.value.toLowerCase();
        const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(textoBusqueda));
        mostrarProductos(productosFiltrados, tipoDeCambio);
    });
});


class Usuario {
    constructor(nombre, nomUsuario, contrasenia, foto) {
        this.nombre = nombre;
        this.nomUsuario = nomUsuario;
        this.contrasenia = contrasenia;
        this.foto = foto;
    }

    chequearDatosDeIngreso(nomUsuario, contrasenia) {
        return this.nomUsuario === nomUsuario && this.contrasenia === contrasenia;
    }
}

const usuariosHarcodeados = [
    new Usuario("Alejandro Di Stefano", "profe", "1234", "https://avatars.githubusercontent.com/u/88512335?v=4"),
    new Usuario("David García", "programador", "1234", "https://64.media.tumblr.com/77f632311d04082bdaa3833acc043fd7/tumblr_ns6at2opJ81sz0wpdo1_640.jpg"),
    new Usuario("Lionel Messi", "dios", "2022", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT50rBtXg3fsHuMLt2idatpzylBS96xvNstkQ&s")
];


const loginBoton = document.createElement('button');
loginBoton.innerHTML = `<a href="#" id="login">Login</a>`;
document.querySelector('#header').appendChild(loginBoton);


document.addEventListener("DOMContentLoaded", function () {
    const login = document.getElementById("login");
    const titulo = document.getElementById("titulo");
    titulo.style.padding = "7px";

    if (localStorage.getItem("sesionActiva")) {
        const sesionActiva = JSON.parse(localStorage.getItem("sesionActiva"));
        titulo.innerHTML = `
            Bienvenido/a ${sesionActiva.nombre}
            <img src="${sesionActiva.foto}" alt="foto" style="width: 40px; border-radius: 50%;">
        `;
        titulo.style.color = "green";
        login.textContent = "Logout";
        login.style.color = "red";
    } else {
        login.style.color = "lightgreen";
    }

    login.addEventListener("click", (e) => {
        e.preventDefault();

        if (localStorage.getItem("sesionActiva")) {
            Swal.fire({
                title: "¿Está seguro?",
                text: "Se cerrará la sesión.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cerrar sesión!",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("sesionActiva");
                    titulo.innerHTML = "Bienvenido Usuario";
                    login.textContent = "Login";
                    login.style.color = "";
                    location.reload();
                }
            });
        } else {
            Swal.fire({
                title: "Iniciar Sesión",
                html: `
                    <input type="text" id="nomUsuario" class="swal2-input" placeholder="Usuario">
                    <input type="password" id="contrasenia" class="swal2-input" placeholder="Contraseña">
                `,
                confirmButtonText: 'Iniciar Sesión',
                focusConfirm: false,
                preConfirm: () => {
                    const nomUsuario = Swal.getPopup().querySelector('#nomUsuario').value;
                    const contrasenia = Swal.getPopup().querySelector('#contrasenia').value;
                    if (!nomUsuario || !contrasenia) {
                        Swal.showValidationMessage('Por favor ingresa ambos campos');
                        return false;
                    }
                    return { nomUsuario, contrasenia };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const { nomUsuario, contrasenia } = result.value;
                    const usuario = usuariosHarcodeados.find(u => u.chequearDatosDeIngreso(nomUsuario, contrasenia));

                    if (usuario) {
                        titulo.innerHTML = `
                            Bienvenido/a ${usuario.nombre}
                            <img src="${usuario.foto}" alt="foto" style="width: 40px; border-radius: 50%;">
                        `;
                        localStorage.setItem("sesionActiva", JSON.stringify(usuario));
                        Swal.fire({
                            title: `¡Bienvenido, ${usuario.nombre}!`,
                            html: `
                                <img src="${usuario.foto}" alt="foto" style="width: 200px; border-radius: 50%;">
                            `,
                            icon: 'success'
                        });
                        titulo.style.color = "green";
                        login.textContent = "Logout";
                        login.style.color = "red";
                    } else {
                        Swal.fire("Error", "Usuario o contraseña incorrectos", "error");
                    }
                }
            });
        }
    });
});
