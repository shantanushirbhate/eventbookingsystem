import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, A11y } from "swiper/modules";

import CategoryCard from "./CategoryCard";
import { categories } from "./categoriesData";

import "swiper/css";
import "swiper/css/pagination";

export default function CategoriesCarousel({
  onSelectCategory,
}) {
  return (
    <Swiper
      modules={[Pagination, Keyboard, A11y]}
      spaceBetween={20}
      slidesPerView={1.15}
      grabCursor={true}
      keyboard={{ enabled: true }}
      pagination={{ clickable: true }}
      breakpoints={{
        480: {
          slidesPerView: 1.7,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 2.2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 22,
        },
        1024: {
          slidesPerView: 3.5,
          spaceBetween: 24,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
      }}
      className="event-category-swiper mt-10 !pb-12"
    >
      {categories.map((category) => (
        <SwiperSlide
          key={category.title}
          className="!h-auto"
        >
          <CategoryCard
            category={category}
            onSelectCategory={onSelectCategory}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}