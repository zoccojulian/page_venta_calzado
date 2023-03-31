import { clienteService } from "../service/service.js";

// Futuro manejo de los likes
let likes = JSON.parse( localStorage.getItem( 'simina_like' )) || [];


//chequeo si alguno de los productos guardados en el localStorage ya no esxiste mas
const actualizarLocalStorage = async () => {
    try{
        const todosLosProductos = await clienteService.listarProductos();

        likes = likes.filter( ( idguardado ) => { 
            if (todosLosProductos.find( (producto) => producto.id == idguardado) !== undefined ){
                return true;
            }else{
                return false;
            }
        })

        guardarStorage();

    }catch(e){
        console.log(e)
    }
}

actualizarLocalStorage();



const buscarProducto = ( id ) => {
    return likes.find(producto => { if (producto == id) return true });
}

const guardarStorage = () => {
    localStorage.setItem('simina_like', JSON.stringify(likes));
}

const toggle = (id) => {

    if (buscarProducto(id)){
        likes = likes.filter ( ( numero) => numero !== id)
    }else{
        likes.push(id);
    }

    guardarStorage();
}

const likeIsSave =  ( id ) => {

    let bandera;
    
        const likeEncontrado = buscarProducto(id);

        if ( !likeEncontrado ){
            bandera = false;
        }else{
            bandera = true;
        }
        
    return bandera;
}

export const local = {
    toggle,
    likeIsSave
}