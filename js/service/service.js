
const url = '../../assets/json/lista_productos.json';
// const urlSale = '../../assets/json/lista_sale.json';

const listarProductos = () => fetch(url).then((respuesta) => respuesta.json()).catch((error) => error);

// const listarSale = () => fetch(urlSale).then((respuesta) => respuesta.json()).catch((error) => error);

export const clienteService = {
    listarProductos
}