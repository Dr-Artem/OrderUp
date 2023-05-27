import { Api } from 'js/api';
import { useEffect, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

const variable = new Api();

const SideSlider = ({ restaurants, setProducts }) => {
    const selectedRestaurantId = sessionStorage.getItem('selectedRestaurantId');
    const [activeIndex, setActiveIndex] = useState(
        restaurants?.findIndex(restaurant => restaurant._id === selectedRestaurantId)
    );

    useEffect(() => {
        sessionStorage.setItem('activeSlideIndex', activeIndex);
    }, [activeIndex]);

    const activeIndexHandler = event => {
        const index = event.realIndex;
        const restaurantId = restaurants[index]._id;

        const allProductsByRestaurant = variable.allProductsByRestaurant(restaurantId);
        allProductsByRestaurant.then(({ data }) => {
            setProducts(data.products);
        });
        setActiveIndex(index);
    };

    return (
        <Swiper
            initialSlide={activeIndex !== undefined && activeIndex}
            onSlideChange={e => activeIndexHandler(e)}
            onClick={e => {
                selectedRestaurantId
                    ? alert('For order you can only choose from current restaurant.')
                    : e.slideToClickedSlide();
            }}
            slidesPerView={3}
            spaceBetween={120}
            centeredSlides={true}
            loop={true}
            speed={750}
        >
            {restaurants?.map(({ logo, _id }) => {
                return (
                    <SwiperSlide id={_id} key={_id}>
                        {/* <div> */}
                        <img src={logo} alt="" />
                        {/* </div> */}
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default SideSlider;
