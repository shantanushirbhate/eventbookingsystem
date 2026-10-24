import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard } from "swiper/modules";

import ReviewCard from "./ReviewCard";
import { reviews } from "./reviewsData";

import "swiper/css";
import "swiper/css/pagination";

export default function ReviewsCarousel() {
  const swiperRef = useRef(null);

  return (
    <div className="review-swiper relative mt-10 px-1 sm:px-8 lg:px-10">
      {/* Previous button */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous customer reviews"
        className="absolute left-0 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-orange-600 hover:bg-orange-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:-left-1 sm:h-11 sm:w-11"
      >
        <ChevronLeft size={23} />
      </button>

      {/* Reviews slider */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onBeforeDestroy={() => {
          swiperRef.current = null;
        }}
        modules={[Pagination, Keyboard]}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        grabCursor
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        className="!pb-12"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="!h-auto">
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Next button */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next customer reviews"
        className="absolute right-0 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-orange-600 hover:bg-orange-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:-right-1 sm:h-11 sm:w-11"
      >
        <ChevronRight size={23} />
      </button>
    </div>
  );
}