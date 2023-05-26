import { DirectionsRenderer, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

import * as geolib from 'geolib';
import { Api } from 'js/api';
import * as yup from 'yup';

import style from './CartPage.module.css';

const variable = new Api();
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
    address: yup.string().required('Address is a required field'),
});

const locations = [
    { latitude: 40.777845, longitude: -73.982342 },
    { latitude: 40.743789, longitude: -73.926801 },
    { latitude: 40.726565, longitude: -73.98594 },
];

const CartPage = () => {
    const [cartItems, setCartItems] = useState(JSON.parse(sessionStorage.getItem('cartItems')) || []);
    const [totalPrice, setTotalPrice] = useState(0);

    const [selected, setSelected] = useState(null);
    const [address, setAddress] = useState(null);
    const [directions, setDirections] = useState();

    const mapRef = useRef();
    const onLoad = useCallback(map => (mapRef.current = map), []);
    const center = useMemo(() => ({ lat: 40.735582, lng: -73.992571 }), []);
    const options = useMemo(
        () => ({
            disableDefaultUI: true,
            clickableIcons: false,
            zoomControl: true,
            streetViewControl: false,
        }),
        []
    );

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

    useEffect(() => {
        const totalPrice = calculateTotalPrice();
        setTotalPrice(totalPrice);
        // eslint-disable-next-line
    }, [cartItems, formik.values]);

    const handleSubmitForm = values => {
        const orderData = {
            costumer: values.name,
            email: values.email,
            phoneNumber: values.phone,
            address: address,
            products: cartItems.map(({ _id }) => ({
                productId: _id,
                quantity: values[Object.keys(values).find(key => key === _id)],
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

    const fetchDirection = ({ lat, lng }) => {
        // eslint-disable-next-line no-undef
        const directionService = new google.maps.DirectionsService();
        const closestLocation = geolib.findNearest({ latitude: lat, longitude: lng }, locations);
        const originLocation = { lat: closestLocation.latitude, lng: closestLocation.longitude };

        directionService.route(
            {
                origin: originLocation,
                destination: { lat, lng },
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK' && result) {
                    console.log(result);
                    setDirections(result);
                }
            }
        );
    };

    const removeFromCart = product => {
        const filteredItems = cartItems.filter(item => item._id !== product._id);
        setCartItems(filteredItems);
        sessionStorage.setItem('cartItems', JSON.stringify(filteredItems));

        const remainingRestaurantIds = filteredItems.map(item => item.restaurantId);
        const uniqueRestaurantIds = [...new Set(remainingRestaurantIds)];

        if (uniqueRestaurantIds.length === 1) {
            return;
        } else {
            sessionStorage.removeItem('selectedRestaurantId');
        }
    };

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((accumulator, product) => {
            const itemsQuantity = formik.values[product._id];
            const totalItemPrice = product.price * itemsQuantity;
            return accumulator + totalItemPrice;
        }, 0);

        return total;
    };

    return (
        <div className={style.orderSection}>
            <div>
                <div className={style.mapContainer}>
                    {!isLoaded ? (
                        <div>Loading</div>
                    ) : (
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={center}
                            zoom={12}
                            options={options}
                            // eslint-disable-next-line no-undef
                            mapTypeId={google.maps.MapTypeId.ROADMAP}
                            onLoad={onLoad}
                        >
                            {directions && <DirectionsRenderer directions={directions} />}
                            {selected && <Marker position={selected} />}
                        </GoogleMap>
                    )}
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className={style.orderFormContainer}>
                        <div>
                            {!isLoaded ? (
                                <div>Loading</div>
                            ) : (
                                <PlacesAutocomplete
                                    formik={formik}
                                    fetchDirection={fetchDirection}
                                    setSelected={position => {
                                        setSelected(position);
                                        mapRef.current?.panTo(position);
                                    }}
                                    setAddress={setAddress}
                                />
                            )}
                        </div>
                        <div className={style.orderInputList}>
                            <div className={style.orderInputWrapper}>
                                <input
                                    className={style.orderInput}
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    {...formik.getFieldProps('name')}
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className={style.helperText}>{formik.errors.name}</div>
                                ) : null}
                            </div>
                            <div className={style.orderInputWrapper}>
                                <input
                                    className={style.orderInput}
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="example@mail.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className={style.helperText}>{formik.errors.email}</div>
                                ) : null}
                            </div>

                            <div className={style.orderInputWrapper}>
                                <input
                                    className={style.orderInput}
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+380"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    {...formik.getFieldProps('phone')}
                                />
                                {formik.touched.phone && formik.errors.phone ? (
                                    <div className={style.helperText}>{formik.errors.phone}</div>
                                ) : null}
                            </div>

                            <div>{directions && <Distance leg={directions.routes[0].legs[0]} />}</div>
                            <div className={style.orderSubmit}>
                                {totalPrice !== 0 && (
                                    <p className={style.orderSubmitText}>Total: {totalPrice} &#8372;</p>
                                )}
                                <button className={style.orderSubmitBtn} type="submit">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className={style.productsOrder}>
                <ul className={style.productsList}>
                    {cartItems.map(product => {
                        const itemsQuantity = formik.values[product._id];
                        const totalItemPrice = product.price * itemsQuantity;

                        return (
                            <li className={style.productsItem} key={product._id}>
                                <img src={product.imageUrl} width={200} height={200} alt="" />
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

const PlacesAutocomplete = ({ setSelected, setAddress, fetchDirection, formik }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
    });

    const handleInput = e => {
        setValue(e.target.value);
    };

    const handleSelect =
        ({ description }) =>
        () => {
            setAddress(description);
            setValue(description, false);
            clearSuggestions();

            getGeocode({ address: description }).then(results => {
                const { lat, lng } = getLatLng(results[0]);
                setSelected({ lat, lng });
                fetchDirection({ lat, lng });
            });
        };

    const renderSuggestions = () =>
        data.map(suggestion => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li className={style.orderAdressItem} key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> - <small>{secondary_text}</small>
                </li>
            );
        });

    return (
        <div className={style.orderAdressContainer}>
            <input
                className={style.orderInputAdress}
                id="address"
                name="address"
                type="text"
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Your address"
                {...formik.getFieldProps('address')}
            />
            {formik.touched.address && formik.errors.address ? (
                <div className={style.helperText}>{formik.errors.address}</div>
            ) : null}
            {status === 'OK' && <ul className={style.orderAdressList}>{renderSuggestions()}</ul>}
        </div>
    );
};

const Distance = ({ leg }) => {
    const distance = leg.distance.text;
    const duration = leg.duration.text;
    return (
        <div>
            <p>Distance: {distance}</p>
            <p>Delivery time: {duration}</p>
        </div>
    );
};
