
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import HeroContent from "./HeroContent";
import HeroSearch from "./HeroSearch";
import { heroBackground } from "./heroDataa";

const heroImages = [
  heroBackground,
  "//"];

export default function Hero({ onSearch }) {
  return (
    <section className="hero-font relative isolate min-h-[750px] overflow-hidden bg-orange-950">
      {/* Background Image Slider */}
      <Swiper
       modules={[Autoplay, Pagination, EffectFade]}
  effect="fade"
  autoplay={{
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  pagination={{ clickable: true }}
  loop
  className="hero-swiper absolute inset-0 h-full w-full"
      >
        {heroImages.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${image}")`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-orange-950/75 via-amber-950/45 to-orange-900/20" />

      {/* Hero Content */}
      <div className="relative z-20 mx-auto grid min-h-[750px] max-w-7xl items-center gap-10 px-5 py-20 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
        <HeroContent />
        <HeroSearch onSearch={onSearch} />
      </div>

      {/* Slider Styling */}
      <style>{`
        .hero-swiper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero-swiper .swiper-wrapper,
        .hero-swiper .swiper-slide {
          width: 100%;
          height: 100%;
        }

        .hero-swiper .swiper-slide > div {
          width: 100%;
          height: 100%;
        }

         {
          color: white;
          background: rgba(0, 0, 0, 0.4);
          width: 42px;
          height: 42px;
          border-radius: 50%;
        }

        {
          font-size: 16px;
          font-weight: bold;
        }

        .hero-swiper .swiper-pagination {
          bottom: 22px;
        }

        .hero-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          background: #f97316;
          opacity: 1;
        }

        @media (max-width: 640px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            width: 32px;
            height: 32px;
          }

          .hero-swiper .swiper-button-next::after,
          .hero-swiper .swiper-button-prev::after {
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
}
