import ReviewsHeading from "./ReviewsHeading";
import ReviewsCarousel from "./ReviewsCarousel";

export default function CustomerReviews() {
  return (
    <section
      id="reviews"
      className="eventnest-section overflow-hidden px-5 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <ReviewsHeading />

        <ReviewsCarousel />
      </div>
    </section>
  );
}