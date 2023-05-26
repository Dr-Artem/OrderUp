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

        const allProducts = variable.allProducts();
        allProducts.then(({ data }) => {
            setProducts(data.products);
        });
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
    };

    const removeFromCart = product => {
        const filteredItems = cartItems.filter(item => item._id !== product._id);
        setCartItems(filteredItems);
        sessionStorage.setItem('cartItems', JSON.stringify(filteredItems));

        const remainingRestaurantIds = filteredItems.map(item => item.restaurantId);
        const uniqueRestaurantIds = [...new Set(remainingRestaurantIds)];

        if (uniqueRestaurantIds.length === 1) {
            setSelectedRestaurantId(uniqueRestaurantIds[0]);
        } else {
            setSelectedRestaurantId(null);
        }
    };

    return (
        <section className={style.shopSection}>
            <div className="container">
                <div className={style.shopSlider}>
                    <SideSlider
                        restaurants={restaurants}
                        setProducts={setProducts}
                        selectedRestaurantId={selectedRestaurantId}
                    />
                </div>
                <div className={style.shopContent}>
                    <ul className={style.productList}>
                        {products?.map((product, index) => {
                            return (
                                <li key={index}>
                                    <div>
                                        <div>
                                            <img src={product.imageUrl} alt="" />
                                        </div>
                                        <p>{product.name}</p>
                                        <div>
                                            <p>{product.price}</p>
                                            {cartItems.some(item => item._id === product._id) ? (
                                                <button type="button" onClick={() => removeFromCart(product)}>
                                                    Remove
                                                </button>
                                            ) : (
                                                <button type="button" onClick={() => addToCart(product)}>
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
