import axios from 'axios';
export const fetchProducts = async () => {
    const response = await axios.get('/api/products');
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data;
}