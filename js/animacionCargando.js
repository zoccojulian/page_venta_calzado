import { Bodimovin } from "./bodimovin_class.js";

const cargandoContainer = document.querySelector('.animacion__charge');
const cargando = new Bodimovin(cargandoContainer, true, true,'../assets/bodimovin/simina_logo.json');
window.addEventListener('DOMContentLoaded', (e)=> {

    setTimeout(() => {
        cargando.destroy();
        document.querySelector('.cargando').classList.add('cargado');
    }, 3000);

});