import { Autocomplete, DirectionsRenderer, GoogleMap, LoadScript, Marker, useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

import { useFormik } from 'formik';
import { Api } from 'js/api';
import { useMemo, useRef, useState } from 'react';
import * as yup from 'yup';

// import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from '@reach/combobox';
// import '@reach/combobox/styles.css';

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
});

const locations = [
    { lat: 40.777845, lng: -73.982342 },
    { lat: 40.743789, lng: -73.926801 },
    { lat: 40.726565, lng: -73.98594 },
];

const CartPage = () => {
    const [cartItems, seCartItems] = useState(JSON.parse(sessionStorage.getItem('cartItems')) || []);
    const [selected, setSelected] = useState(null);
    const [address, setAddress] = useState(null);
    const center = useMemo(
        () => ({
            lat: 40.735582,
            lng: -73.992571,
        }),
        []
    );
    const [directionResponse, setDirectionResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const destinationRef = useRef();

    // eslint-disable-next-line
    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    //     libraries: ['places'],
    // });

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
        };

        variable
            .createOrder(orderData)
            .then(({ data }) => {
                console.log('Order placed:', data);
                seCartItems([]);
                sessionStorage.removeItem('cartItems');
            })
            .catch(error => {
                console.error('Failed to place order:', error);
            });
    };

    const initialFormValues = {
        name: '',
        phone: '',
        email: '',
        address: '',
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

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    };

    const calculateRoute = async () => {
        if (destinationRef.current.value === '') {
            return;
        }
        // eslint-disable-next-line no-undef
        const directionService = new google.maps.DirectionsService();
        const results = await directionService.route({
            origin: 'New York',
            destination: destinationRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        });

        setDirectionResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
    };
    return (
        <div>
            <>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={selected || center}
                    zoom={12}
                    options={options}
                >
                    {destinationRef.current.value && <Marker position={destinationRef.current.value} />}
                    {directionResponse && <DirectionsRenderer directions={directionResponse} />}
                </GoogleMap>
            </>
            <button type="button" onClick={calculateRoute}>
                Calculate
            </button>
            {/* <PlacesAutoComplete setSelected={setSelected} setAddress={setAddress} /> */}
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@mail.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+380"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <Autocomplete>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Address"
                            ref={destinationRef}
                            // value={formik.values.address}
                            // onChange={e => {
                            //     setAddress(e.target.value);
                            // }}
                        />
                    </Autocomplete>
                </div>

                <ul>
                    {cartItems.map(({ _id, imageUrl, name, price }) => {
                        const itemsQuantity = formik.values[Object.keys(formik.values).find(key => key === _id)];
                        const totalItemPrice = price * itemsQuantity;

                        return (
                            <li key={_id}>
                                <div>
                                    <img src={imageUrl} width={70} height={70} alt="" />
                                </div>
                                <p>{name}</p>
                                <p>{totalItemPrice}</p>
                                <input
                                    id={_id}
                                    defaultValue={1}
                                    name={_id}
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formik.values.quantity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </li>
                        );
                    })}
                </ul>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
export default CartPage;

const mapContainerStyle = {
    height: '400px',
    width: '100%',
};

const PlacesAutoComplete = ({ setSelected, setAddress }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
    });

    const handleSelect = async address => {
        setAddress(address);
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
    };
    // return (
    //     <Combobox onSelect={handleSelect}>
    //         <ComboboxInput
    //             value={value}
    //             onChange={e => {
    //                 setValue(e.target.value);
    //             }}
    //             disabled={!ready}
    //             className="combobox-input"
    //             placeholder="Search an address"
    //         />
    //         <ComboboxPopover>
    //             <ComboboxList>
    //                 {status === 'OK' &&
    //                     data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
    //             </ComboboxList>
    //         </ComboboxPopover>
    //     </Combobox>
    // );
};

// import * as tt from '@tomtom-international/web-sdk-maps';
// import '@tomtom-international/web-sdk-maps/dist/maps.css';
// import { useFormik } from 'formik';
// import { Api } from 'js/api';
// import { useEffect, useRef, useState } from 'react';
// import * as yup from 'yup';

// const variable = new Api();
// const regexNumber = /^\+\d{1,3}\s?s?\d{1,}\s?\d{1,}\s?\d{1,}$/;
// const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
// const schema = yup.object().shape({
//     name: yup
//         .string()
//         .min(3, 'Username must be at least 3 characters')
//         .max(200, 'Username must be less than or equal to 200 characters')
//         .required('Username is a required field'),
//     phone: yup.string().matches(regexNumber, 'Invalid phone number').required('Phone is a required field'),
//     email: yup.string().matches(regexEmail, 'Invalid email address').required('Email is a required field'),
// });

// // const locations = [
// //     { lat: 40.777845, lng: -73.982342 },
// //     { lat: 40.743789, lng: -73.926801 },
// //     { lat: 40.726565, lng: -73.98594 },
// // ];

// const CartPage = () => {

//     const [cartItems, seCartItems] = useState(JSON.parse(sessionStorage.getItem('cartItems')) || []);
//     const mapElement = useRef();
//     const [lng, setLng] = useState(-73.992571);
//     const [lat, setLat] = useState(40.735582);
//     const [map, setMap] = useState({});

//     // const [selected, setSelected] = useState(null);
//     // const [address, setAddress] = useState(null);

//     useEffect(() => {
//         let map = tt.map({
//             key: process.env.REACT_APP_TOM_TOM_API_KEY,
//             container: mapElement.current,
//             stylesVisibility: {
//                 trafficIncidents: true,
//                 trafficFlow: true,
//             },
//             center: [lng, lat],
//             zoom: 12,
//         });

//         setMap(map);

//         return map.remove;
//     }, []);

//     const handleSubmitForm = values => {
//         const orderData = {
//             costumer: values.name,
//             email: values.email,
//             phoneNumber: values.phone,
//             address: values.address,
//             products: cartItems.map(({ _id }) => ({
//                 productId: _id,
//                 quantity: values[Object.keys(values).find(key => key === _id)],
//             })),
//         };

//         variable
//             .createOrder(orderData)
//             .then(({ data }) => {
//                 console.log('Order placed:', data);
//                 seCartItems([]);
//                 sessionStorage.removeItem('cartItems');
//             })
//             .catch(error => {
//                 console.error('Failed to place order:', error);
//             });
//     };

//     const initialFormValues = {
//         name: '',
//         phone: '',
//         email: '',
//         address: '',
//     };
//     cartItems.forEach(({ _id }) => {
//         initialFormValues[_id] = 1;
//     });

//     const formik = useFormik({
//         initialValues: initialFormValues,
//         validationSchema: schema,
//         onSubmit: values => {
//             handleSubmitForm(values);
//         },
//     });

//     return (
//         <div>
//             <div ref={mapElement} className="map-container" />

//             <form onSubmit={formik.handleSubmit}>
//                 <div>
//                     <input
//                         id="name"
//                         name="name"
//                         type="text"
//                         placeholder="Name"
//                         value={formik.values.name}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                     />
//                     <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         placeholder="example@mail.com"
//                         value={formik.values.email}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                     />
//                     <input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         placeholder="+380"
//                         value={formik.values.phone}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                     />

//                     <input
//                         id="address"
//                         name="address"
//                         type="text"
//                         placeholder="Address"
//                         value={formik.values.address}
//                         onChange={formik.handleChange}
//                     />
//                 </div>

//                 <ul>
//                     {cartItems.map(({ _id, imageUrl, name, price }) => {
//                         const itemsQuantity = formik.values[Object.keys(formik.values).find(key => key === _id)];
//                         const totalItemPrice = price * itemsQuantity;

//                         return (
//                             <li key={_id}>
//                                 <div>
//                                     <img src={imageUrl} width={70} height={70} alt="" />
//                                 </div>
//                                 <p>{name}</p>
//                                 <p>{totalItemPrice}</p>
//                                 <input
//                                     id={_id}
//                                     defaultValue={1}
//                                     name={_id}
//                                     type="number"
//                                     min="1"
//                                     max="100"
//                                     value={formik.values.quantity}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                 />
//                             </li>
//                         );
//                     })}
//                 </ul>
//                 <button type="submit">Submit</button>
//             </form>
//         </div>
//     );
// };
// export default CartPage;
