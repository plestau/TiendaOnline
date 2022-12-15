$(document).ready(function () {
    var peticionEnCurso = false;
    var categoria = null;

    // ocultamos todo lo que no sea el menú de inicio (cargar 8 productos)
    $('#login').hide();
    $('#registrarse').hide();
    $('#disponible_carrito').hide();
    $('#form_envio').hide();

    // Configuramos la pantalla de carga
    configureLoadingScreen($('#loading-screen'));

    // Cargamos los primeros 8 productos
    mostrarOchoProductos();

    function mostrarOchoProductos() {
        fetch('https://fakestoreapi.com/products?limit=8')
            .then(res => res.json())
            .then(data => {
                data.forEach(producto => {
                    let div = document.createElement('div');
                    div.className = 'tarjeta';
                    div.innerHTML = `
                                <h5 class="tarjeta__title">${producto.title}</h5>
                                <img src="${producto.image}" class="tarjeta__imagen">
                                <div class="tarjeta__body">
                                    <p class="tarjeta__description">${producto.description}</p>
                                    <p class="tarjeta__price">Precio: ${producto.price} $</p>
                                </div>
                                <input type="button" value="Añadir al carrito" class="tarjeta__button_añadir">
                                `;
                    $('#disponible').append(div);
                });
            });
    }

    // La pantalla de carga parpadea como efecto visual
    function configureLoadingScreen(screen) {
        $(document)
            .ajaxStart(function () {
                screen.fadeIn();
            })
            .ajaxStop(function () {
                screen.fadeOut();
            });
    }

    // funcion para cargar más tarjetas a medida que el usuario hace scroll (si hay mñas productos disponibles)
    function peticionScroll() {
        if (!peticionEnCurso) {
            peticionEnCurso = true;
            // si está dentro de alguna categoria, se carga la siguiente pagina de esa categoria
            if (categoria == null) {
                var url = 'https://fakestoreapi.com/products';
            } else {
                var url = 'https://fakestoreapi.com/products/category/' + categoria;
            }
            $.ajax({
                url: url,
                success: function (data) {
                    data.forEach(producto => {
                        let div = document.createElement('div');
                        div.className = 'tarjeta';
                        div.innerHTML = `
                        <h5 class="tarjeta__title">${producto.title}</h5>
                        <img src="${producto.image}" class="tarjeta__imagen">
                        <div class="tarjeta__body">
                            <p class="tarjeta__description">${producto.description}</p>
                            <p class="tarjeta__price">Precio: ${producto.price} $</p>
                        </div>
                        <input type="button" value="Añadir al carrito" class="tarjeta__button_añadir">
                        `;
                        $('#disponible').append(div);
                    });
                },
            })
            // si quieres que cargue infinito aunque ya lo haya cargado:
            // peticionEnCurso = false
        }
    }

    // detecta cuando se llega al final del documento
    function scroll() {
        if (window.scrollY + window.innerHeight + 10000 >= document.body.scrollHeight) {
            peticionScroll();
        }
        else {
            peticionEnCurso = false;
        }
    }

    window.addEventListener('scroll', () => {
        // si estoy en el carrito, se detiene la carga de productos
        if (categoria == "carrito") {
            $('#loading-screen').fadeOut(
                function () {
                    document.removeEventListener('scroll', () => { });
                });
        }
        else {
            scroll();
        }
    });

    // Carga una categoria de productos
    function cargarCategoria() {
        $('#disponible').empty();
        fetch("https://fakestoreapi.com/products/category/" + categoria)
            .then(res => res.json())
            .then(data => {
                data.forEach(producto => {
                    let div = document.createElement('div');
                    div.className = 'tarjeta';
                    div.innerHTML = `
                <h5 class="tarjeta__title">${producto.title}</h5>
                <img src="${producto.image}" class="tarjeta__imagen">
                <div class="tarjeta__body">
                    <p class="tarjeta__description">${producto.description}</p>
                    <p class="tarjeta__price">Precio: ${producto.price} $</p>
                </div>
                <input type="button" value="Añadir al carrito" class="tarjeta__button_añadir">
                `;
                    $('#disponible').append(div);
                });
            });
    }

    // Calcula el precio total del carrito
    function calcularTotal() {
        let total = 0;
        productos_carrito = JSON.parse(localStorage.getItem('productos_carrito'));
        productos_carrito.forEach(producto_carrito => {
            total += producto_carrito.precio * producto_carrito.cantidad;
            total = Math.round(total * 100) / 100; // redondea a 2 decimales
        });
        $('#total').html(`Total: ${total} $`);
    }

    function guardarEnLocalStorage(productos_carrito){
        localStorage.setItem('productos_carrito', JSON.stringify(productos_carrito));
    }

    // Esconde los div en caso de ser necesario
    function cambiarCategoria() {
        if (categoria == 'carrito') {
            $('#disponible_carrito').hide();
        }
        if (categoria == 'login') {
            $('#login').hide();
        }
    }

    function escondeEstado() {
        setTimeout(function () {
            $('#estado').text('');
        }, 6000);
    }

    // cambiando la vista al pulsar en los botones de categorias
    $('#electronica').click(function () {
        cambiarCategoria();
        categoria = "electronics";
        cargarCategoria();
    });
    $('#joyeria').click(function () {
        cambiarCategoria();
        categoria = "jewelery";
        cargarCategoria();
    });
    $('#hombre').click(function () {
        cambiarCategoria();
        categoria = "men's clothing";
        cargarCategoria();
    });
    $('#mujer').click(function () {
        cambiarCategoria();
        categoria = "women's clothing";
        cargarCategoria();
    });

    // botones ascendente y descendente que ordenan los productos mediante el id de la api
    $('#descendente').click(function () {
        $('#disponible').empty();
        if (categoria == null) {
            fetch('https://fakestoreapi.com/products?sort=desc')
                .then(res => res.json())
                .then(data => {
                    data.forEach(producto => {
                        let div = document.createElement('div');
                        div.className = 'tarjeta';
                        div.innerHTML = `
                    <h5 class="tarjeta__title">${producto.title}</h5>
                    <img src="${producto.image}" class="tarjeta__imagen">
                    <div class="tarjeta__body">
                        <p class="tarjeta__description">${producto.description}</p>
                        <p class="tarjeta__price">Precio: ${producto.price} $</p>
                    </div>
                    <input type="button" value="Añadir al carrito" class="tarjeta__button_añadir">
                    `;
                        $('#disponible').append(div);
                    });
                });
        } else {
            fetch('https://fakestoreapi.com/products/category/' + categoria + '?sort=desc')
                .then(res => res.json())
                .then(data => {
                    data.forEach(producto => {
                        let div = document.createElement('div');
                        div.className = 'tarjeta';
                        div.innerHTML = `
                        <h5 class="tarjeta__title">${producto.title}</h5>
                        <img src="${producto.image}" class="tarjeta__imagen">
                        <div class="tarjeta__body">
                            <p class="tarjeta__description">${producto.description}</p>
                            <p class="tarjeta__price">Precio: ${producto.price} $</p>
                        </div>
                        <input type="button" value="Añadir al carrito" class="tarjeta__button_añadir">
                        `;
                        $('#disponible').append(div);
                    });
                });
        }
    });
    $('#ascendente').click(function () {
        $('#disponible').empty();
        if (categoria == null) {
            fetch('https://fakestoreapi.com/products?sort=asc')
                .then(res => res.json())
                .then(data => {
                    data.forEach(producto => {
                        let div = document.createElement('div');
                        div.className = 'tarjeta';
                        div.innerHTML = `
                    <h5 class="tarjeta__title">${producto.title}</h5>
                    <img src="${producto.image}" class="tarjeta__imagen">
                    <div class="tarjeta__body">
                        <p class="tarjeta__price">Precio: ${producto.price} $</p>
                    </div>
                    <input type="button" value="Añadir al carrito" class="tarjeta__button_añadir">
                    `;
                        $('#disponible').append(div);
                    });
                });
        } else {
            fetch('https://fakestoreapi.com/products/category/' + categoria + '?sort=asc')
                .then(res => res.json())
                .then(data => {
                    data.forEach(producto => {
                        let div = document.createElement('div');
                        div.className = 'tarjeta';
                        div.innerHTML = `
                        <h5 class="tarjeta__title">${producto.title}</h5>
                        <img src="${producto.image}" class="tarjeta__imagen">
                        <div class="tarjeta__body">
                            <p class="tarjeta__price">Precio: ${producto.price} $</p>
                        </div>
                        <input type="button" value="Añadir al carrito" class="tarjeta__button_añadir">
                        `;
                        $('#disponible').append(div);
                    });
                });
        }
    });

    // al pulsar en el boton de añadir al carrito, se añade el producto al carrito
    $('#disponible').on('click', '.tarjeta__button_añadir', function () {
        // guardamos todos los datos de la tarjeta
        let producto = $(this).parent().find('.tarjeta__title').text();
        let precio = $(this).parent().find('.tarjeta__price').text();
        // ya que guarda todo el texto de la etiqueta, separamos el precio del texto
        precio = precio.split(":");
        precio = precio[1];
        precio = precio.split("$");
        precio = precio[0];
        let imagen = $(this).parent().find('.tarjeta__imagen').attr('src');
        let existe = false;
        // si no existe el carrito, se crea (esto debería de ir en iniciar sesión pero como no va la api, lo creo al añadir un producto por primera vez)
        let productos_carrito = JSON.parse(localStorage.getItem('productos_carrito'));
        if (productos_carrito == null) {
            productos_carrito = [];
        }
        // si el producto ya estaba en el carrito, se aumenta la cantidad
        productos_carrito.forEach(producto_carrito => {
            if (producto_carrito.producto == producto) {
                existe = true;
                producto_carrito.cantidad++;
            }
        });
        // si no estaba en el carrito, se añade
        if (!existe) {
            productos_carrito.push({
                producto: producto,
                precio: precio,
                imagen: imagen,
                cantidad: 1
            });
        }
        guardarEnLocalStorage(productos_carrito);
        // muestra al usuario algún tipo de feedback
        $('#estado').text('Producto añadido al carrito');
        escondeEstado();
    });

    // al pulsar en el boton de eliminar del carrito, se elimina el producto del carrito, tanto la tarjeta como de localStorage
    $('#disponible_carrito').on('click', '.tarjeta__button_borrar', function () {
        let producto = $(this).parent().find('.tarjeta__title').text();
        let productos_carrito = JSON.parse(localStorage.getItem('productos_carrito'));
        productos_carrito.forEach((producto_carrito, index) => {
            if (producto_carrito.producto == producto) {
                productos_carrito.splice(index, 1);
            }
        });
        $(this).parent().remove();
        guardarEnLocalStorage(productos_carrito);
        calcularTotal();
        // muestra al usuario algún tipo de feedback
        $('#estado').text('Producto eliminado del carrito');
        escondeEstado();
    });

    // al pulsar en el icono del carrito o en carrito, se muestra el carrito
    $('header').on('click', '#carrito', function () {
        // si no hay productos en el carrito, se muestra un mensaje
        if (localStorage.getItem('productos_carrito') == null || JSON.parse(localStorage.getItem('productos_carrito')).length == 0) {
            $('#estado').text('No hay productos en el carrito');
            escondeEstado();
        } else {
            cambiarCategoria();
            categoria = "carrito";
            // muestra solo el carrito
            $('#disponible').empty();
            $('#orden').hide();
            $('#disponible_carrito').show();
            // por cada producto del localstorage, crea una tarjeta
            let productos_carrito = JSON.parse(localStorage.getItem('productos_carrito'));
            productos_carrito.forEach(producto_carrito => {
                let div = document.createElement('div');
                div.className = 'tarjeta__carrito';
                div.innerHTML = `
                <h5 class="tarjeta__title">${producto_carrito.producto}</h5>
                <img src="${producto_carrito.imagen}" class="tarjeta__imagen">
                <div class="tarjeta__body">
                    <p class="tarjeta__cantidad">Cantidad: ${producto_carrito.cantidad}</p>
                    <p class="tarjeta__price">Precio: ${producto_carrito.precio * producto_carrito.cantidad} $</p>
                </div>
                <input type="button" value="Eliminar del carrito" class="tarjeta__button_borrar">
                <input type="button" value="Editar cantidad" class="tarjeta__button_editar">
                `;
                $('#carrito_productos').append(div);
            });
            // si hay tarjetas idénticas, se elimina una, así al pulsar varias veces en el carro, no se añaden varias veces
            let tarjetas = document.querySelectorAll('.tarjeta__carrito');
            for (let i = 0; i < tarjetas.length; i++) {
                for (let j = i + 1; j < tarjetas.length; j++) {
                    if (tarjetas[i].querySelector('.tarjeta__title').innerHTML == tarjetas[j].querySelector('.tarjeta__title').innerHTML) {
                        tarjetas[i].remove();
                    }
                }
            }
            calcularTotal();
        }
    });

    $('#disponible_carrito').on('click', '.tarjeta__button_editar', function () {
        // editar la cantidad de ese producto
        let producto = $(this).parent().find('.tarjeta__title').text();
        let cantidad = $(this).parent().find('.tarjeta__cantidad').text();
        cantidad = cantidad.split(' ')[1];
        let productos_carrito = JSON.parse(localStorage.getItem('productos_carrito'));
        productos_carrito.forEach(producto_carrito => {
            if (producto_carrito.producto == producto) {
                let precio = producto_carrito.precio;
                // cambia la cantidad por un input number
                $(this).parent().find('.tarjeta__cantidad').html(`<input type="number" value="${cantidad}" class="tarjeta__input_cantidad">`);
                producto_carrito.precio = precio;
                // cambia el boton editar por un boton guardar
                $(this).val('Guardar');
                $(this).removeClass('tarjeta__button_editar').addClass('tarjeta__button_guardar');
            }
        });
        guardarEnLocalStorage(productos_carrito);
    });

    $('#disponible_carrito').on('click', '.tarjeta__button_guardar', function () {
        let productos_carrito = JSON.parse(localStorage.getItem('productos_carrito'));
        let cantidad = $(this).parent().find('.tarjeta__input_cantidad').val();
        let producto = $(this).parent().find('.tarjeta__title').text();

        $(this).parent().find('.tarjeta__cantidad').text(`Cantidad: ${cantidad}`);
        if (cantidad <= 0) {
            $(this).parent().remove();
            productos_carrito.forEach((producto_carrito, index) => {
                if (producto_carrito.producto == producto) {
                    productos_carrito.splice(index, 1);
                    $('#estado').text('Producto eliminado del carrito');
                    escondeEstado();
                }
            });
        } else {
            // cambia el boton guardar por un boton editar
            $(this).val('Editar cantidad');
            $(this).removeClass('tarjeta__button_guardar').addClass('tarjeta__button_editar');
            // cambia el valor de cantidad y de precio en el array de productos_carrito
            productos_carrito.forEach(producto_carrito => {
                let precio = producto_carrito.precio;
                $(this).parent().find('.tarjeta__price').text(`Precio: ${precio * cantidad} $`);
                if (producto_carrito.producto == producto) {
                    producto_carrito.cantidad = cantidad;
                    producto_carrito.precio = precio;
                }
            });
        }
        guardarEnLocalStorage(productos_carrito);
        calcularTotal();
    });

    // al pulsar el boton vaciar carrito, elimina el carrito y vuelve al inicio
    $('#vaciar').on('click', function () {
        $('#carrito_productos').empty();
        localStorage.removeItem('productos_carrito');
        alert('Carrito vaciado');
        $('#total').text('Total: 0 $');
        location.reload();
    });


    // al pulsar en el boton de detalles, se muestra solo esa tarjeta con la descripcion
    $('#disponible').on('click', '.tarjeta__imagen', function () {
        categoria = "carrito"; // al igual que en el carro, aqui no hay scroll infinito
        // copia la tarjeta en la que se ha pulsado
        let tarjeta = $(this).parent().clone();
        $('#disponible').empty();
        $('#orden').hide();
        // Eliminamos el boton de detalles
        tarjeta.find('.tarjeta__button_detalles').remove();
        // muestra la descripción y centra la tarjeta
        tarjeta.find('.tarjeta__description').css('display', 'block');
        tarjeta.find('.tarjeta__description').css('height', 'auto');
        $('#disponible').append(tarjeta);
        $('#disponible').css('display', 'flex');
        $('#disponible').css('justify-content', 'center');
        // evita que al pulsar repetidas veces en la imagen, se multipliquen los botones
        if ($('#disponible').find('.volver').length > 1) {
            $('#disponible').find('.volver').last().remove();
        }
        // cambia la clase de la tarjeta por tarjeta__detallada
        $('#disponible').find('.tarjeta').removeClass('tarjeta').addClass('tarjeta__detallada');
    });

    // al pulsar iniciarsesion, se oculta todo menos el div login
    $('#iniciarsesion').on('click', function () {
        $('#disponible').hide();
        $('#disponible_carrito').hide();
        $('#login').show();
        categoria = 'login';
    });

    // si pulsas registrarse se muestra el div registrarse se hace visible
    $('#registrate').on('click', function () {
        // muestra el div registrarse
        $('#registrarse').show();
        // si pulsa el boton enviar
        $('#registrarse').on('click', '#registrar_submit', function () {
            // si algún campo está vacío, da error
            if ($('#registrarse').find('#nombre').val() == '' || $('#registrarse').find('#correo').val() == '' || $('#registrarse').find('#contrasena').val() == '') {
                alert('Rellena todos los campos');
            } else {
                const btn = document.getElementById('registrar_submit');
                document.getElementById('registrarme')
                    .addEventListener('submit', function (event) {
                        event.preventDefault();

                        btn.value = 'Registrando...';

                        const serviceID = 'default_service';
                        const templateID = 'template_egpvks4';

                        emailjs.sendForm(serviceID, templateID, this)
                            .then(() => {
                                btn.value = 'Registrarse';
                                alert('¡Correo de registro enviado!');
                            }, (err) => {
                                btn.value = 'Registrarse';
                                alert(JSON.stringify(err));
                            });

                        email = $('#registrarse').find('#correo').val();
                        username = $('#registrarse').find('#usuario').val();
                        password = $('#registrarse').find('#contraseña').val();
                        firstname = $('#registrarse').find('#nombre').val();
                        lastname = $('#registrarse').find('#apellidos').val();
                        city = $('#registrarse').find('#ciudad').val();
                        phone = $('#registrarse').find('#telefono').val();

                        fetch('https://fakestoreapi.com/users', {
                            method: "POST",
                            body: JSON.stringify(
                                {
                                    email: email,
                                    username: username,
                                    password: password,
                                    name: {
                                        firstname: firstname,
                                        lastname: lastname
                                    },
                                    address: {
                                        city: city,
                                    },
                                    phone: phone
                                }
                            )
                        })
                            .then(res => res.json())
                    });
                $('#registrarse').hide();
                $('#login').hide();
                $('#disponible').show();
                $('#orden').show();
                $('#disponible_carrito').hide();
            }
        });
    });

    // al hacer click en comprar, se muestra un formulario para rellenar los datos
    $('#disponible_carrito').on('click', '#comprar', function () {
        // si hay algun campo vacío, da error
        if ($('#disponible_carrito').find('#nombre').val() == '' || $('#disponible_carrito').find('#apellidos').val() == '' || $('#disponible_carrito').find('#direccion').val() == '' || $('#disponible_carrito').find('#ciudad').val() == '' || $('#disponible_carrito').find('#telefono').val() == '') {
            alert('Rellena todos los campos');
        } else {
            total = $('#total').text();
            // vacia el div disponible_carrito
            $('#disponible_carrito').empty();
            // muestra el div comprar
            $('#form_envio').show();
            // añade un input con el total a form_enviar
            $('#form_enviar').append('<input type="hidden" name="total_pedido" id="total_pedido" value="' + total + '">');
            // si pulsa el boton enviar
            $('#form_envio').on('click', '#enviar_pedido', function () {
                const btn = document.getElementById('enviar_pedido');

                document.getElementById('form_enviar')
                    .addEventListener('submit', function (event) {
                        total = JSON.stringify(total);
                        event.preventDefault();

                        btn.value = 'Completando pedido...';

                        const serviceID = 'default_service';
                        const templateID = 'template_7g9257m';

                        emailjs.sendForm(serviceID, templateID, this)
                            .then(() => {
                                btn.value = 'Comprar';
                                alert('¡Pedido Realizado!');
                            }, (err) => {
                                btn.value = 'Comprar';
                                alert(JSON.stringify(err));
                            });
                        // vacía productos_carrito del localstorage
                        localStorage.removeItem('productos_carrito');
                        // esconde el form_envio
                        $('#form_envio').hide();
                        // muestra el div disponible
                        $('#disponible').show();
                        mostrarOchoProductos();
                    });
            });

        }
    });

    // Al hacer click en el logo, boton volver y al logearse (ya que no funcionan) vuelven a cargar la página desde el inicio
    $('#logo').click(function () {
        location.reload();
    });
    $('.volver').click(function () {
        location.reload();
    });
    $('#login_submit').click(function () {
        location.reload();
    });
});
