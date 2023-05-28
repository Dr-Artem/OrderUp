import { DirectionsRenderer, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import Map from 'components/GoogleMap/GoogleMap';
import OrderForm from 'components/OrderForm/OrderForm';
import { useFormik } from 'formik';
import { Api } from 'js/api';
import { useRef, useState } from 'react';

import * as yup from 'yup';
import style from './CartPage.module.css';

const regexNumber = /^\+\d{1,3}\s?s?\d{1,}\s?\d{1,}\s?\d{1,}$/;
const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const schema = yup.object().shape({
    name: yup
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(200, 'Username must be less than or equal to 200 characters')
        .required('Username is a required field'),
    phone: yup.string().matches(regexNumber, 'Invalid phone number').required('Phone is a required field'),
    email: yup.string().matches(regexEmail, 'Invalid email address').required('Email is a required field'),
});
const variable = new Api();

const CartPage = () => {
    const [cartItems, setCartItems] = useState(JSON.parse(sessionStorage.getItem('cartItems')) || []);
    const [totalPrice, setTotalPrice] = useState(0);

    const [selected, setSelected] = useState(null);
    const [address, setAddress] = useState(null);
    const [directions, setDirections] = useState();

    const mapRef = useRef();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });

    const initialFormValues = {
        name: '',
        phone: '',
        email: '',
    };

    cartItems.forEach(({ _id }) => {
        initialFormValues[_id] = 1;
    });

    const formik = useFormik({
        initialValues: initialFormValues,
        validationSchema: schema,
        onSubmit: values => {
            handleSubmitForm(values);
        },
    });

    const handleSubmitForm = values => {
        const orderData = {
            costumer: values.name,
            email: values.email,
            phoneNumber: values.phone,
            address: address,
            products: cartItems.map(({ _id }) => ({
                product: _id,
                quantity: values[_id],
            })),
            total: totalPrice,
        };

        variable
            .createOrder(orderData)
            .then(({ data }) => {
                console.log('Order placed:', data);
                setCartItems([]);
                sessionStorage.removeItem('cartItems');
                sessionStorage.removeItem('selectedRestaurantId');
                formik.resetForm();
            })
            .catch(error => {
                console.error('Failed to place order:', error);
            });
    };

    const removeFromCart = product => {
        const filteredItems = cartItems.filter(item => item._id !== product._id);
        setCartItems(filteredItems);
        sessionStorage.setItem('cartItems', JSON.stringify(filteredItems));
        if (filteredItems.length === 0) {
            sessionStorage.removeItem('selectedRestaurantId');
        }
    };

    return (
        <div className={style.orderSection}>
            <div>
                <Map
                    DirectionsRenderer={DirectionsRenderer}
                    GoogleMap={GoogleMap}
                    Marker={Marker}
                    mapRef={mapRef}
                    isLoaded={isLoaded}
                    directions={directions}
                    selected={selected}
                />
                <OrderForm
                    setTotalPrice={setTotalPrice}
                    cartItems={cartItems}
                    formik={formik}
                    setDirections={setDirections}
                    setSelected={setSelected}
                    isLoaded={isLoaded}
                    mapRef={mapRef}
                    setAddress={setAddress}
                    directions={directions}
                    totalPrice={totalPrice}
                />
            </div>
            <div className={style.productsOrder}>
                <ul className={style.productsList}>
                    {cartItems.map(product => {
                        const itemsQuantity = formik.values[product._id];
                        const totalItemPrice = product.price * itemsQuantity;

                        return (
                            <li className={style.productsItem} key={product._id}>
                                <img
                                    src={product.imageUrl}
                                    style={{
                                        borderRadius: '12px',
                                    }}
                                    width={200}
                                    height={200}
                                    alt=""
                                />
                                <div className={style.productsInfo}>
                                    <div className={style.productsContent}>
                                        <p className={style.productsName}>{product.name}</p>
                                        <p className={style.productsPrice}>{totalItemPrice} &#8372;</p>
                                    </div>
                                    <div className={style.productsChange}>
                                        <div>
                                            <input
                                                className={style.productsInput}
                                                id={product._id}
                                                defaultValue={1}
                                                name={product._id}
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={formik.values.quantity}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>

                                        <button
                                            className={style.productsBtn}
                                            type="button"
                                            onClick={() => removeFromCart(product)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
export default CartPage;
