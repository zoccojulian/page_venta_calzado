import { Bodimovin } from "./bodimovin_class.js";
import { elementos } from "./elementos_html/elementos.js";
import { controlMenu} from "./boton_menu.js";


//Cuando vuelvo de otra página al index, redirecciona a la sección presionada
window.addEventListener('load', (e) => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get('id');
    if(id !== null){
        setTimeout(() => {
            document.querySelector(`#${id}`).scrollIntoView({
                behavior: 'smooth'
            });
        }, 1000);
    }
});

/**
 * Creación de la flecha den banner y el listener para movernos
 */
const flechaBanner = document.querySelector('.banner__flecha');
const animFlechaBanner = new Bodimovin(flechaBanner, true, true,'../assets/bodimovin/tres_flechas.json');
flechaBanner.addEventListener('click', (ev) => {
    document.querySelector('#productos').scrollIntoView({
        behavior: 'smooth'
      });
});



/**
 * Creación de botones flecha de Productos y Sale
 */
const flechaProductos = document.getElementById('flecha__productos');
const animationflechaProductos = new Bodimovin(flechaProductos, true, true,'../assets/bodimovin/tres_flechas.json');

const flechaSale = document.getElementById('flecha__sale');
const animationflechaSale = new Bodimovin(flechaSale, true, true,'../assets/bodimovin/tres_flechas.json');




/**
 * Creación de animación "como comprar"
 */
 const comoComprar = document.querySelector('.comoComprar__anim');
 const animComoComprar = new Bodimovin(comoComprar, true, true,'../assets/img/graphic/como_comprar/comprar.json');

/**
 * Creación de animación "metodos de envio"
 */
 const metodoDeEnvios = document.querySelector('.envios__anim');
 const animaMetodosDeEnvio = new Bodimovin(metodoDeEnvios, true, true,'../assets/img/graphic/moto/entregas.json');

 /**
 * Creación de animación "formas de pago"
 */
  const pagos = document.querySelector('.pagos__anim');
  const animPagos = new Bodimovin(pagos, true, true,'../assets/img/graphic/pagos/pagos.json');


/**
 * Scroll animado de los item del menu hacia las secciones
 */
var links = document.querySelectorAll(".lista__item a");
links.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
        evento.preventDefault();
        if(window.outerWidth < 992){ //chequear jquery cuando se haga responsividad para ver corte
            
            //Chequea si el link es del header o del footer. Si es del footer, no tiene
            // que cerrar el menu
            
            if (evento.target.parentNode.classList.contains('header__lista__item') || 
                evento.target.parentNode.parentNode.classList.contains('header__lista__item')){
                controlMenu.animMenu().toggle();
                controlMenu.listaMenu().classList.toggle('list__in');
            }
            
        };
        let link = evento.currentTarget.getAttribute('href');
        document.querySelector(link).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


//Cargar productos el section productos. Se cargan 8 productos

elementos.cargarUltimosProductos(document.getElementById('productos__container'));

elementos.cargarUltimosSale(document.getElementById('sale__container'));




//Acción de botones de preguntas frecuentes
const listaBotonPregunta = document.querySelectorAll('.pregunta__titulo__boton');

listaBotonPregunta.forEach( ( boton ) => {
    const animacionMas = new Bodimovin(boton, false, false,'../assets/bodimovin/mas_menos.json');
    boton.addEventListener('click', (ev) => {
        animacionMas.toggle();
        boton.parentNode.parentNode.querySelector('.pregunta__respuesta').classList.toggle('respuesta__out');
    });
} );
