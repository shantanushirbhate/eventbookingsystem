export default function GalleryPaginationStyles() {
  return (
    <style>{`
      .gallery-swiper .swiper-pagination-bullet {
        background-color: #f97316;
        opacity: 0.35;
        transition: all 0.25s ease;
      }

      .gallery-swiper .swiper-pagination-bullet-active {
        background-color: #f97316;
        opacity: 1;
      }
    `}</style>
  );
}