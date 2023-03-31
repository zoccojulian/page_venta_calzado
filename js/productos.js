import { elementos } from "./elementos_html/elementos.js";
import { controlMenu} from "./boton_menu.js";


window.addEventListener('load', (e) => {
    const param = new URLSearchParams(window.location.search);
    const card = param.get('card');
    const id = param.get('id');
    
    if(card !== null){
        if (card == 'productos'){
            document.querySelector('.productos__titulo').innerHTML = '<h2>NUESTROS <b>PRODUCTOS</b></h2>';
            elementos.cargarProductos(document.getElementById('productos__container'));
            if(id !== null){
                elementos.cargarProductosElegido(document.querySelector('.producto__elegido'), id);
            }
            
        }else{
            document.querySelector('.productos__titulo').innerHTML = '<h2><b>SALE</b></h2>';
            elementos.cargarSale(document.getElementById('productos__container'));
            if(id !== null){
                elementos.cargarProductosElegidoSale(document.querySelector('.producto__elegido'), id);
            }
            
        } 

    }
});
