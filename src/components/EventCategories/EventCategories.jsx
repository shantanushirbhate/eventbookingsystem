
import CategoriesHeading from "./CategoriesHeading";
import CategoriesCarousel from "./CategoriesCarousel";
import CategoryPaginationStyles from "./CategoryPaginationStyles";

export default function EventCategories({
  onSelectCategory,
}) {
  return (
    <section
      id="event-types"
      className="outfit-font py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <CategoriesHeading />

        <CategoriesCarousel
          onSelectCategory={onSelectCategory}
        />
      </div>

      <CategoryPaginationStyles />
    </section>
  );
}
