import axios from 'axios';
axios.defaults.baseURL = 'http://192.168.1.14:8588/api/v1';

export const fetchProducts = async (page:any, pageSize:any) => {
    const response = await axios.get(`/products?pagina=${page}&pagina_registros=${pageSize}&sucursal=1`);
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data.data
};