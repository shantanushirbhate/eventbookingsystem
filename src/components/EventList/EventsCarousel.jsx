import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard } from "swiper/modules";

import EventCard from "../EventCard/EventCard";

import "swiper/css";
import "swiper/css/pagination";

export default function EventsCarousel({
  events,
  onViewDetails,
}) {
  const swiperRef = useRef(null);

  return (
    <div className="event-swiper relative mt-8">
      {/* Previous Arrow */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous events"
        className="absolute -left-3 top-[40%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:-left-5 sm:h-11 sm:w-11"
      >
        <ChevronLeft size={22} />
      </button>

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
        {events.map((event) => (
          <SwiperSlide key={event.id} className="!h-auto">
            <EventCard
              event={event}
              onViewDetails={onViewDetails}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Next Arrow */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next events"
        className="absolute -right-3 top-[40%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:-right-5 sm:h-11 sm:w-11"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}