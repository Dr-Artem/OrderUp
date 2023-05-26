import { Api } from 'js/api';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

const variable = new Api();

const SideSlider = ({ restaurants, setProducts, selectedRestaurantId }) => {
    const activeIndexHandler = event => {
        const index = event.realIndex;
        const restaurantId = restaurants[index]._id;

        const allProductsByRestaurant = variable.allProductsByRestaurant(restaurantId);
        allProductsByRestaurant.then(({ data }) => {
            setProducts(data.products);
        });
    };

    return (
        <Swiper
            // onSlideChange={e => activeIndexHandler(e)}
            onActiveIndexChange={e => activeIndexHandler(e)}
            onClick={e => {
                selectedRestaurantId
                    ? alert('For order you can only choose from current restaurant.')
                    : e.slideToClickedSlide();
            }}
            slidesPerView={3}
            spaceBetween={70}
            centeredSlides={true}
            loop={true}
            speed={1000}
        >
            {restaurants?.map(({ name, logo, _id }) => {
                return (
                    <SwiperSlide id={_id} key={_id}>
                        <div>
                            <img src={logo} alt="" />
                        </div>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default SideSlider;
