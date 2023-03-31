import { Bodimovin } from "./bodimovin_class.js";
import { elementos } from "./elementos_html/elementos.js";

/**
 * Creación botón hamburger
 */
const buttonMenu = document.querySelector('.header__hamburger');
const menu = document.querySelector('.header__lista__container');
const animationHamburger = new Bodimovin(buttonMenu, false, false,'../assets/bodimovin/menu.json');
buttonMenu.addEventListener('click', (e) => {
    animationHamburger.toggle();
    menu.classList.toggle('list__in');
});

/**
 * Chequea si hay productos SALE. Si no hay, borra el link "sale" del
 * menu y del footer (display:none), al igual que a la sección SALE
 */
elementos.isSale().then( (respuesta) => {
    if (respuesta == false){
        const saleFooter = document.querySelector('.footer__sale');
        const headerFooter = document.querySelector('.header__sale');
        saleFooter.style.display = 'none';
        headerFooter.style.display = 'none';
        if (document.querySelector('.sale') !== null){
            document.querySelector('.sale').style.display ='none';
        }

    }
});





const animMenu = () => {
    return animationHamburger
}

const listaMenu = () => {
    return menu
}

//Si se hace click fuera del menu cuando esta abierto, este se cierra
window.addEventListener('click', (ev) => {

    if (listaMenu().classList.contains('list__in') && (( ev.clientX > 330 ) || ( ev.clientY > 430 ))){
        animMenu().toggle();
        listaMenu().classList.toggle('list__in');

    }
});


export const controlMenu = {
    animMenu,
    listaMenu
}