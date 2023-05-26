import axios from 'axios';

const URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: URL,
    // params: {
    //     page: 1,
    // },
});

export class Api {
    allRestaurants = async () => {
        const { data } = await api.get('/restaurants');
        return data;
    };
    allProducts = async () => {
        const { data } = await api.get('/products');
        return data;
    };
    allProductsByRestaurant = async restaurantId => {
        const { data } = await api.get(`/products/${restaurantId}`);
        return data;
    };
    allOrders = async () => {
        const { data } = await api.get('/orders');
        return data;
    };
    createOrder = async credentials => {
        const { data } = await api.post('/orders/create', credentials);
        return data;
    };
}
