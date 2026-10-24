export default function CategoryPaginationStyles() {
  return (
    <style>{`
      .event-category-swiper .swiper-pagination {
        bottom: 0 !important;
      }

      .event-category-swiper .swiper-pagination-bullet {
        background: #f97316;
        opacity: 0.35;
        transition: all 0.25s ease;
      }

      .event-category-swiper .swiper-pagination-bullet-active {
        background: #f97316;
        opacity: 1;
        width: 22px;
        border-radius: 999px;
      }
    `}</style>
  );
}