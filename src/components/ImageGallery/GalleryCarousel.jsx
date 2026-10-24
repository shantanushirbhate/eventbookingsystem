import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import GalleryCard from "./GalleryCard";

import "swiper/css";
import "swiper/css/pagination";

export default function GalleryCarousel({
  images,
  activeCategory,
  onSelectImage,
}) {
  const swiperRef = useRef(null);

  return (
    <div className="gallery-swiper relative mt-10 px-1 sm:px-8 lg:px-10">
      {/* Previous arrow */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous gallery images"
        className="absolute left-0 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:-left-1 sm:h-11 sm:w-11 lg:-left-1"
      >
        <ChevronLeft size={23} />
      </button>

      <Swiper
        key={activeCategory}
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
        }}
        className="!pb-12"
      >
        {images.map((item) => (
          <SwiperSlide key={item.id} className="!h-auto">
            <GalleryCard
              item={item}
              onSelect={onSelectImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Next arrow */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next gallery images"
        className="absolute right-0 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:-right-1 sm:h-11 sm:w-11 lg:-right-1"
      >
        <ChevronRight size={23} />
      </button>
    </div>
  );
}