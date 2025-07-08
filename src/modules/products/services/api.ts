import axios from 'axios';
axios.defaults.baseURL = 'http://192.168.1.14:8588/api/v1';

export const fetchProducts = async () => {
    const response = await axios.get('/products?pagina=1&pagina_registros=100&sucursal=1');
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data.data
}