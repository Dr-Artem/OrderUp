import Distance from 'components/Distance/Distance';
import PlacesAutocomplete from 'components/PlacesAutocomplete/PlacesAutocomplete';
import * as geolib from 'geolib';
import { useEffect } from 'react';

import style from './OrderForm.module.css';

const locations = [
    { latitude: 40.777845, longitude: -73.982342 },
    { latitude: 40.743789, longitude: -73.926801 },
    { latitude: 40.726565, longitude: -73.98594 },
];

const OrderForm = ({
    setTotalPrice,
    cartItems,
    formik,
    setDirections,
    setSelected,
    isLoaded,
    mapRef,
    setAddress,
    directions,
    totalPrice,
}) => {
    useEffect(() => {
        const totalPrice = calculateTotalPrice();
        setTotalPrice(totalPrice);
        // eslint-disable-next-line
    }, [cartItems, formik.values]);

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((accumulator, product) => {
            const itemsQuantity = formik.values[product._id];
            const totalItemPrice = product.price * itemsQuantity;
            return accumulator + totalItemPrice;
        }, 0);

        return total;
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

    return (
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
                        {totalPrice !== 0 && <p className={style.orderSubmitText}>Total: {totalPrice} &#8372;</p>}
                        <button className={style.orderSubmitBtn} type="submit">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default OrderForm;
