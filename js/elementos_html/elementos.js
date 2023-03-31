import { Bodimovin } from "../bodimovin_class.js";
import { clienteService } from "../service/service.js";
import { local } from "../service/localSave.js";

const urlFotos = './assets/img/productos'

//variable para poder identificar los setInterval y borrarlos
//cuando no sirvan mas
let setIntervalID;
let fotoCarrouselNumero = 0;

/**
 * 
 * Devuelve un string para el href del boton <a> de coneccion
 * con whattsapp con el nombre del producto que le pasemos
 */
const hrefWhattsapp = ( nombre ) => {
    return `https://api.whatsapp.com/send?phone=5491130457469&text=¡Hola! Estoy en la página de SIMINA BA y quiero pedir más información sobre las - ${nombre} -`;
}

/**
 * Se le pasa la lista de fotos y genera un carrousel infinito
 */
const carrousel = ( inicio, lista ) => {
    const cantidadDeFotos = lista.childElementCount;
    fotoCarrouselNumero = inicio;
    clearInterval(setIntervalID);
    setIntervalID = setInterval(() => {
        if(fotoCarrouselNumero < cantidadDeFotos-1){
            fotoCarrouselNumero++;
        }else{
            fotoCarrouselNumero = 0;
        } 
        lista.style.transform = `translateX(-${100/cantidadDeFotos*fotoCarrouselNumero}%)`;   
    },5000);

}


const cargarListenerBotonesCarrousel = () => {
    document.querySelector('.control__izq').addEventListener('click', (ev) => {
            
        //veo la foto que se esta viendo
        const fotosCarrouselLista = document.querySelector('.lista__elegido');
        const cantidadDeFotos = fotosCarrouselLista.childElementCount;
        if(fotoCarrouselNumero > 0){
            carrousel(fotoCarrouselNumero - 1, fotosCarrouselLista);
            fotosCarrouselLista.style.transform = `translateX(-${100/cantidadDeFotos*fotoCarrouselNumero}%)`;   
        }else{
            carrousel(cantidadDeFotos - 1, fotosCarrouselLista);
            fotosCarrouselLista.style.transform = `translateX(-${100/cantidadDeFotos*(fotoCarrouselNumero)}%)`; 
        }

    });

    document.querySelector('.control__der').addEventListener('click', (ev) => {
        //veo la foto que se esta viendo
        const fotosCarrouselLista = document.querySelector('.lista__elegido');
        const cantidadDeFotos = fotosCarrouselLista.childElementCount;
        if(fotoCarrouselNumero < cantidadDeFotos-1){
            carrousel(fotoCarrouselNumero + 1, fotosCarrouselLista);
            fotosCarrouselLista.style.transform = `translateX(-${100/cantidadDeFotos*fotoCarrouselNumero}%)`;   
        }else{
            carrousel(0, fotosCarrouselLista);
            fotosCarrouselLista.style.transform = `translateX(-0%)`;
        }
    });
}

/**
 * Carga las flechas animadas de las card
 * Se le pasa por parámetro 'productos' o 'sale' como string, de acuerdo
 * a lo que se le pase, carga la flecha ya que tienen clases diferentes clases
 *
 */
const cargarFlechasAnimadas = (tipoDeCard) => {

    if(tipoDeCard == 'sale'){
        document.querySelectorAll('.f__sale').forEach((button) => {
            const animationButton = new Bodimovin(button, true, true,'../assets/bodimovin/flecha_boton.json');
        });
    } else if(tipoDeCard == 'productos'){
        document.querySelectorAll('.f__producto').forEach((button) => {
            const animationButton = new Bodimovin(button, true, true,'../assets/bodimovin/flecha_boton.json');
        });
    }

    
}


/**
 * 
 * Tomas los botones de las card y les asigna un addEventListener
 * para que se abran en la sección 'producto elegido' de acuerdo si es
 * un producto nuevo(stock=false) o producto sale(stock=true)
 */
const cargarLinkBotonesCard = (tipoDeCard) => {
    document.querySelectorAll('.card__ver').forEach((boton) => {
        let direccion = boton.href
        let param = new URLSearchParams(direccion.match(/[?][\w=&]*/)[0]);
        let id = param.get('id');

        boton.addEventListener('click', (ev) => {
            ev.preventDefault();

                if(tipoDeCard == 'productos'){
                    cargarProductosElegido(document.querySelector('.producto__elegido'), id);
                }else{
                    cargarProductosElegidoSale(document.querySelector('.producto__elegido'), id);
                }
                
                document.querySelector('#home').scrollIntoView({
                    behavior: 'smooth'
                });
            
            
        })
    });
}


/**
 * Genera ua card de producto nuevo (stock=false)
 * 
 * @returns retorna una card
 */
const cardProducto = (producto) => {

    const card = document.createElement('div');
    card.classList.add('productos__card');
    card.id = producto.id;

    const htmlInner = `
            <div class="card__img" style="background-image: url('${urlFotos}/${producto.carpeta}/${producto.fotos[0]}')">
                <div class="nuevo__ingreso">
                    <span class="nuevo__ingreso__texto">NUEVO INGRESO</span>
                </div>
                <i class="like bi bi-heart"></i>
            </div>
            <div class="card__nombre__producto">
                <span>
                    ${producto.nombre}
                </span>
            </div>
            <div class="card__footer">
                <a href="productos.html?id=${producto.id}&card=productos" class="card__ver">Ver Producto <div class="flecha__button f__producto"></div></a>
            </div>
    `;

    card.innerHTML = htmlInner;

    //Habilita el cartel "nuevo ingreso" si hace menos de 1 mes que se subió el producto
    const hoy= new Date();
    const fechaProducto = new Date(producto.fecha_ingreso);
    fechaProducto.setDate(fechaProducto.getDate() + 30);
    if((fechaProducto.getTime() - hoy.getTime())<0){
        card.querySelector('.nuevo__ingreso').style.visibility = "hidden";
    };

    //averiguo si estan guardados los like en el local storage
    if (local.likeIsSave(producto.id)){
        card.querySelector('.like').classList.toggle('bi-heart');
        card.querySelector('.like').classList.toggle('bi-heart-fill');
    }

    
    // Listener al corazon para darle like
    card.querySelector('.like').addEventListener('click', (ev) => {
        ev.target.classList.toggle('bi-heart');
        ev.target.classList.toggle('bi-heart-fill');
        local.toggle(producto.id)
    });

    return card;

}

/**
 * Genera ua card de producto sale (stock=true)
 * 
 * @returns retorna una card
 */
const cardSale = (producto) => {
    const card = document.createElement('div');
    card.classList.add('productos__card');
    card.id = producto.id;
    const htmlInner = `
            <div class="card__img" style="background-image: url('${urlFotos}/${producto.carpeta}/${producto.fotos[0]}')">
                <i class="like bi bi-heart"></i>
            </div>
            <div class="card__talles">
                <div class="talles__titulo">
                    <span>EN STOCK</span>
                </div>
                <ul class="card__talles__lista">
                    <li class="card__talles__item">35</li>
                    <li class="card__talles__item">36</li>
                    <li class="card__talles__item">37</li>
                    <li class="card__talles__item">38</li>
                    <li class="card__talles__item">39</li>
                    <li class="card__talles__item">40</li>
                </ul>
            </div>
            <div class="card__nombre__producto">
                <span>
                    ${producto.nombre}
                </span>
            </div>
            <div class="card__precio">
                <div class="precio__antes">
                    <span>Antes: <del>$${producto.precioAntes}</del></span>
                </div>
                <div class="precio__ahora">
                    <span>AHORA: $${producto.precioAhora}</span>
                </div>
            </div>
            <div class="card__footer">
                <a href="productos.html?id=${producto.id}&card=sale" class="card__ver">Ver Producto <div class="flecha__button f__sale"></div></a>
            </div>
    `;
    card.innerHTML = htmlInner;
    const talles = card.querySelectorAll('.card__talles__item');
    talles.forEach((talle) => {
        const encontrado = producto.talles.find(valor => { if (valor == talle.innerHTML) return true });
        if(encontrado !== undefined){
            talle.classList.add('en__stock');
        }

    });

    //averiguo si estan guardados los like en el local storage
    if (local.likeIsSave(producto.id)){
        card.querySelector('.like').classList.toggle('bi-heart');
        card.querySelector('.like').classList.toggle('bi-heart-fill');
    }

    // Listener al corazon para darle like
    card.querySelector('.like').addEventListener('click', (ev) => {
        ev.target.classList.toggle('bi-heart');
        ev.target.classList.toggle('bi-heart-fill');
        local.toggle(producto.id)
    });

    return card;
}


/**
 * Carga todos los productos nuevo (stock=false)
 * en el elemento del DOM que le pasemos
 * 
 */
const cargarProductos = async (elementoDOM)=> {
    try{
        const lista = await clienteService.listarProductos();
        const listaProductos = lista.filter( producto => !producto.stock);

        listaProductos.forEach( (producto) => {
            const card = cardProducto(producto);
            elementoDOM.appendChild(card)
        });

        //agregado de Flecha animada para los botones de las card
        cargarFlechasAnimadas('productos');

        //Carga los link de los botones de las card para que
        //abran el producto elegido en la misma página
        cargarLinkBotonesCard('productos');
        
        //listener foto para abrir el producto
        document.querySelectorAll('.card__img').forEach((imagen) => {
            imagen.addEventListener('click', (ev) => {
                if( !ev.target.classList.contains('like') ){
                    cargarProductosElegido(document.querySelector('.producto__elegido'), ev.target.parentNode.id);
                    document.querySelector('#home').scrollIntoView({
                    behavior: 'smooth'});
                }
            }); 
        }); 

    }catch(error){
        alert(error);
    }
}

/**
 * Carga todos los productos sale (stock=true)
 * en el elemento del DOM que le pasemos
 * 
 */
const cargarSale = async (elementoDOM) => {
    try{
        const lista = await clienteService.listarProductos();
        const listaProductos = lista.filter( producto => producto.stock)

        listaProductos.forEach( (producto) => {
            const card = cardSale(producto);
            elementoDOM.appendChild(card)
        });

        //agregado de Flecha animada para los botones de las card
        cargarFlechasAnimadas('sale');

        //Carga los link de los botones de las card para que
        //abran el producto elegido en la misma página
        cargarLinkBotonesCard('sale');

        //listener foto para abrir el producto
        document.querySelectorAll('.card__img').forEach((imagen) => {
            imagen.addEventListener('click', (ev) => {
                if( !ev.target.classList.contains('like') ){
                    cargarProductosElegidoSale(document.querySelector('.producto__elegido'), ev.target.parentNode.id);
                    document.querySelector('#home').scrollIntoView({
                        behavior: 'smooth'
                    });  
                }
                
            }); 
        }); 

    }catch(error){
        alert(error);
    }
}


/**
 * Carga los ultimos 6 productos nuevo (stock=false)
 * en el elemento del DOM que le pasemos
 * 
 */
const cargarUltimosProductos = async (elementoDOM) => {
    try{
        const lista = await clienteService.listarProductos();
        const listaProductos = lista.filter(producto => !producto.stock)
        const listaCorta = listaProductos.slice(listaProductos.length - 8, listaProductos.length);
        listaCorta.reverse();
        listaCorta.forEach( (producto) => {
            const card = cardProducto(producto);
            card.querySelector('.card__img').addEventListener('click', (ev) => {

                // TODO: Terminar para que funcionen los likes
                // Chequea que el click sea en la foto pero no el en corazon del like
                if( !ev.target.classList.contains('like') ){
                    window.open(`./productos.html?id=${ev.target.parentNode.id}&card=productos`, "_self");      
                }

            }); 
            elementoDOM.appendChild(card)
        });

        //agregado de Flecha animada para los botones de las card
        cargarFlechasAnimadas('productos');

    }catch(error){
        alert(error);
    }
};


/**
 * Carga los ultimos 6 productos sale (stock=true)
 * en el elemento del DOM que le pasemos
 * 
 */
const cargarUltimosSale = async (elementoDOM) => {
    try{
        const lista = await clienteService.listarProductos();
        const listaProductos = lista.filter( producto => producto.stock)
        
        const listaCorta = listaProductos.slice(listaProductos.length - 8, listaProductos.length); 

        listaCorta.forEach( (producto) => {
            const card = cardSale(producto);
            card.querySelector('.card__img').addEventListener('click', (ev) => {
                if( !ev.target.classList.contains('like') ){
                    window.open(`./productos.html?id=${ev.target.parentNode.id}&card=sale`, "_self");     
                }
            }); 
            elementoDOM.appendChild(card)
        });

        //agregado de Flecha animada para los botones de las card
        cargarFlechasAnimadas('sale');

    }catch(error){
        alert(error);
    }
}

/**
 * 
 * Carga el producto nuevo (stock=false) que le pasemos por id
 * en el elemento del DOM 'producto elegio' que se le pasa.
 */
const cargarProductosElegido = async (elementoDOM, id) => {

    try{
        const lista = await clienteService.listarProductos();
        const producto = lista.find(producto => { if (producto.id == id) return true })

        const hrefWp = hrefWhattsapp(producto.nombre);
        
        const html = `
        <div class="elegido__container">
                <!--<i class="bi bi-heart corazon"></i>-->
                <ul class="lista__elegido">
                </ul>
                <div class="elegido__control">
                    <span class="control__izq control__boton"><i class="bi bi-chevron-double-left"></i></span>
                    <span class="control__der control__boton"><i class="bi bi-chevron-double-right"></i></span>
                </div>
            </div>
            <div class="elegido__descripcion">
                <div class="id">
                    <span>#${producto.id}</span>
                </div>
                <div class="nombre">
                    <span>${producto.nombre}</span>
                </div>
                <div class="talles">
                    <div class="talle__titulo">
                        <span>TALLES:</span>
                    </div>
                    <ul class="lista__talles">
                        <li class="talles__item">35</li>
                        <li class="talles__item">36</li>
                        <li class="talles__item">37</li>
                        <li class="talles__item">38</li>
                        <li class="talles__item">39</li>
                        <li class="talles__item">40</li>
                    </ul>
                </div>
                <div class="elegido__link">
                <a class="link__button" href = "${hrefWp}">
                    <img src="./assets/img/icons/ws.png" alt="">
                    LO QUIERO!
                </a>
            </div>
            </div>
        `

        elementoDOM.innerHTML = html;
        
        const listaFotos = elementoDOM.querySelector('.lista__elegido');
        listaFotos.style.width = `${producto.fotos.length * 100}%`;
        listaFotos.style.transform = `translateX(0%)`;
        producto.fotos.forEach((foto) => {

            const li = document.createElement('li');
            li.classList.add('item__elegido');
            
            const fotoItem = `
            <img src="${urlFotos}/${producto.carpeta}/${foto}" alt="" class="foto__item__elegido">
            `;
            li.innerHTML = fotoItem;

            listaFotos.appendChild(li);
        });

        //inicio el carrusel
        carrousel(0, listaFotos);
        cargarListenerBotonesCarrousel();

    }catch(e){
        console.log('error')

    }
}


/**
 * 
 * Carga el producto sale (stock=true) que le pasemos por id
 * en el elemento del DOM 'producto elegio' que se le pasa.
 */
const cargarProductosElegidoSale = async (elementoDOM, id) => {

    try{
        const lista = await clienteService.listarProductos();
        const producto = lista.find(producto => { if (producto.id == id) return true });

        const hrefWp = hrefWhattsapp(producto.nombre);
        
        const html = `
            <div class="elegido__container">
                <!--<i class="bi bi-heart corazon"></i>-->
                <ul class="lista__elegido">
                </ul>
                <div class="elegido__control">
                    <span class="control__izq control__boton"><i class="bi bi-chevron-double-left"></i></span>
                    <span class="control__der control__boton"><i class="bi bi-chevron-double-right"></i></span>
                </div>
            </div>
            <div class="elegido__descripcion">
                <div class="id">
                    <span>#${producto.id}</span>
                </div>
                <div class="nombre">
                    <span>${producto.nombre}</span>
                </div>
                <div class="talles">
                    <div class="stock">
                        <span>EN STOCK</span>
                    </div>
                    <div class="talle__titulo">
                        <span>TALLES:</span>
                    </div>
                    <ul class="lista__talles">
                        <li class="talles__item">35</li>
                        <li class="talles__item">36</li>
                        <li class="talles__item">37</li>
                        <li class="talles__item">38</li>
                        <li class="talles__item">39</li>
                        <li class="talles__item">40</li>
                    </ul>
                </div>
                <div class="elegido__precio">
                    <div class="elegido__precio__antes">ANTES: <del>$${producto.precioAntes}</del></div>
                    <div class="elegido__precio__ahora">AHORA: $${producto.precioAhora}</div>
                </div>
                <div class="elegido__link">
                <a class="link__button" href = "${hrefWp}">
                    <img src="./assets/img/icons/ws.png" alt="">
                    LO QUIERO!
                </a>
            </div>
            </div>
            
        `;

        elementoDOM.innerHTML = html;
        
        const listaFotos = elementoDOM.querySelector('.lista__elegido');
        listaFotos.style.width = `${producto.fotos.length * 100}%`;
        producto.fotos.forEach((foto) => {
            const li = document.createElement('li');
            li.classList.add('item__elegido');
            const fotoItem = `
            <img src="${urlFotos}/${producto.carpeta}/${foto}" alt="" class="foto__item__elegido">
            `;
            li.innerHTML = fotoItem;

            listaFotos.appendChild(li)
        })

        elementoDOM.querySelectorAll('.talles__item').forEach((talle) => {
            if (producto.talles.find(talleStock => { if (talle.innerHTML == talleStock ) return true })){
                talle.classList.add('en__stock')
            }

        });

        carrousel(0, listaFotos);
        cargarListenerBotonesCarrousel();

    }catch(e){
        console.log('error')

    }
}

const isSale = async () => {
    let bandera;
    try{
        const lista = await clienteService.listarProductos();
        const listaProductos = lista.filter( producto => producto.stock)
        
        if (listaProductos.length == 0){
            bandera = false;
        }else{
            bandera = true;
        }

        return bandera;

    }catch(error){
        alert(error);
    }
}

export const elementos = {
    cargarUltimosProductos,
    cargarUltimosSale,
    cargarProductos,
    cargarSale,
    cargarProductosElegido,
    cargarProductosElegidoSale,
    isSale
}
