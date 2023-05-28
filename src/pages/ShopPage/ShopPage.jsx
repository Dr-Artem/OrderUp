import SideSlider from 'components/SideSlider/SideSlider';
import { Api } from 'js/api';
import { useEffect, useState } from 'react';
import style from './ShopPage.module.css';

const variable = new Api();

const ShopPage = () => {
    const [cartItems, setCartItems] = useState(JSON.parse(sessionStorage.getItem('cartItems')) || []);
    const [restaurants, setRestaurants] = useState();
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [products, setProducts] = useState();

    useEffect(() => {
        const allRestaurants = variable.allRestaurants();
        allRestaurants.then(({ data }) => {
            setRestaurants(data.restaurants);
        });

        setSelectedRestaurantId(sessionStorage.getItem('selectedRestaurantId'));
    }, []);

    const addToCart = product => {
        if (selectedRestaurantId && product.restaurantId !== selectedRestaurantId) {
            alert('Cannot add products from different restaurants.');
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
                <div className={style.shopSlider}>
                    {restaurants && (
                        <SideSlider
                            restaurants={restaurants}
                            setProducts={setProducts}
                            selectedRestaurantId={selectedRestaurantId}
                        />
                    )}
                </div>
                <div className={style.shopContent}>
                    <ul className={style.productList}>
                        {products?.map((product, index) => {
                            return (
                                <li className={style.productItem} key={index}>
                                    <div className={style.productImageWrapper}>
                                        <img src={product.imageUrl} alt="" />
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
