import axios from 'axios';
axios.defaults.baseURL = 'http://192.168.1.14:8588/api/v1';

export const fetchProducts = async (page: any, pageSize: any) => {
    const bearerToken = '2|Xo4eUidaOOh1wJeJfZXg9lIHpS7Iw78dXeHuB1H33275e7b8'
    const response = await axios.get(`/products?pagina=${page}&pagina_registros=${pageSize}&sucursal=1`,
        {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            }
        }
    );
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data.data
};