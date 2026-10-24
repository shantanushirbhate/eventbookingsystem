import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  return (
    <article className="flex h-full min-h-[330px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
      {/* Star rating */}
      <div
        className="flex gap-1"
        aria-label={`${review.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={19}
            aria-hidden="true"
            className={
              index < review.rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        ))}
      </div>

      {/* Review content */}
      <p className="mt-5 flex-1 text-sm leading-7 text-slate-600 sm:text-base">
        “{review.review}”
      </p>

      {/* Customer details */}
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${review.color}`}
        >
          {review.initials}
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-slate-900">
            {review.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {review.role}
          </p>
        </div>
      </div>
    </article>
  );
}