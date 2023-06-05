import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useEffect, useRef, useState } from 'react';

import { UilArrowCircleLeft, UilArrowCircleRight } from '@iconscout/react-unicons';
import '@splidejs/react-splide/css';
import styles from './SideSlider.module.css';

import { Api } from 'js/api';
const variable = new Api();

const SideSlider = ({ restaurants, setProducts, setIndexHandler }) => {
    const selectedRestaurantId = sessionStorage.getItem('selectedRestaurantId');
    const [activeIndex, setActiveIndex] = useState(
        restaurants?.findIndex(restaurant => restaurant._id === selectedRestaurantId)
    );

    useEffect(() => {
        sessionStorage.setItem('activeSlideIndex', activeIndex);
    }, [activeIndex]);

    const activeIndexHandler = slide => {
        const index = slide.index;
        const restaurantId = restaurants[index]._id;
        const allProductsByRestaurant = variable.allProductsByRestaurant(restaurantId);
        allProductsByRestaurant.then(({ data }) => {
            setProducts(data.products);
        });
        setIndexHandler(null);
        setActiveIndex(index);
    };

    const splideRef = useRef(null);
    const handlePrevClick = () => {
        if (selectedRestaurantId) {
            Notify.failure('For order you can only choose from the current restaurant');
        } else {
            splideRef.current.go('-1');
        }
    };

    const handleNextClick = () => {
        if (selectedRestaurantId) {
            Notify.failure('For order you can only choose from the current restaurant');
        } else {
            splideRef.current.go('+1');
        }
    };

    return (
        <div className={styles.sliderWrapper}>
            <button className={styles.sliderNavBtn} onClick={handlePrevClick}>
                <UilArrowCircleLeft className={styles.sliderNavArrow} />
            </button>

            <Splide
                style={{ cursor: selectedRestaurantId && 'not-allowed' }}
                ref={splideRef}
                onActive={activeIndexHandler}
                options={{
                    type: 'loop',
                    lazyLoad: 'nearby',
                    perPage: 3,
                    perMove: 1,

                    focus: 'center',
                    gap: '60px',
                    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',

                    pagination: false,
                    arrows: false,
                    start: activeIndex,
                    drag: selectedRestaurantId ? false : true,
                }}
            >
                {restaurants?.map(({ logo, _id }, index) => {
                    return (
                        <SplideSlide id={_id} key={_id}>
                            <img src={logo} alt="" />
                        </SplideSlide>
                    );
                })}
            </Splide>
            <button onClick={handleNextClick} className={styles.sliderNavBtn}>
                <UilArrowCircleRight className={styles.sliderNavArrow} />
            </button>
        </div>
    );
};

export default SideSlider;
