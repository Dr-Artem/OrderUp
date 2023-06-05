import { UilEllipsisH, UilTimes } from '@iconscout/react-unicons';
import SideSlider from 'components/SideSlider/SideSlider';
import { Api } from 'js/api';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useEffect, useState } from 'react';
import style from './ShopPage.module.css';

const variable = new Api();

const ShopPage = () => {
    const [cartItems, setCartItems] = useState(JSON.parse(sessionStorage.getItem('cartItems')) || []);
    const [restaurants, setRestaurants] = useState();
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [products, setProducts] = useState();
    const [indexHandler, setIndexHandler] = useState(null);

    useEffect(() => {
        const allRestaurants = variable.allRestaurants();
        Loading.standard('Loading...');
        allRestaurants.then(({ data }) => {
            setRestaurants(data.restaurants);
            Loading.remove();
        });

        setSelectedRestaurantId(sessionStorage.getItem('selectedRestaurantId'));
    }, []);

    const addToCart = product => {
        if (selectedRestaurantId && product.restaurantId !== selectedRestaurantId) {
            Notify.failure('For order you can only choose from the current restaurant');
            return;
        }

        const updatedCartItems = [...cartItems, product];
        setCartItems(updatedCartItems);
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setSelectedRestaurantId(product.restaurantId);
        sessionStorage.setItem('selectedRestaurantId', product.restaurantId);
    };

    const removeFromCart = product => {
        const filteredItems = cartItems.filter(item => item._id !== product._id);
        setCartItems(filteredItems);
        sessionStorage.setItem('cartItems', JSON.stringify(filteredItems));
        if (filteredItems.length === 0) {
            setSelectedRestaurantId(null);
            sessionStorage.removeItem('selectedRestaurantId');
        }
    };

    return (
        <section className={style.shopSection}>
            <div className="container">
                {restaurants && (
                    <SideSlider
                        restaurants={restaurants}
                        setProducts={setProducts}
                        selectedRestaurantId={selectedRestaurantId}
                        setIndexHandler={setIndexHandler}
                    />
                )}
                <div className={style.shopContent}>
                    <ul className={style.productList}>
                        {products?.map((product, index) => {
                            return (
                                <li className={style.productItem} key={index}>
                                    <div className={style.productImageWrapper}>
                                        <button
                                            onClick={() => setIndexHandler(index)}
                                            type="button"
                                            className={style.productInfoBtn}
                                        >
                                            <UilEllipsisH />
                                        </button>
                                        <div
                                            className={style.productInfoTextWrapper}
                                            style={{
                                                top: indexHandler === index ? '0%' : '100%',
                                            }}
                                        >
                                            <button
                                                onClick={() => setIndexHandler(null)}
                                                type="button"
                                                className={style.productInfoCloseBtn}
                                            >
                                                <UilTimes />
                                            </button>
                                            <p className={style.productInfoText}>{product.description}</p>
                                        </div>
                                        <img src={product.imageUrl} style={{ width: '100%' }} alt="" />
                                    </div>
                                    <div className={style.productContentWrapper}>
                                        <p className={style.productName}>{product.name}</p>
                                        <div className={style.productOrder}>
                                            <p className={style.productPrice}>{product.price}&#8372;</p>
                                            {cartItems.some(item => item._id === product._id) ? (
                                                <button
                                                    className={style.productBtnRemove}
                                                    type="button"
                                                    onClick={() => removeFromCart(product)}
                                                >
                                                    Remove
                                                </button>
                                            ) : (
                                                <button
                                                    className={style.productBtnSubmit}
                                                    type="button"
                                                    onClick={() => addToCart(product)}
                                                >
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ShopPage;
