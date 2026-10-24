import { MessageCircle } from "lucide-react";

export default function ReviewsHeading() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
        <MessageCircle size={25} />
      </div>

      <p className="mt-4 text-sm font-bold uppercase tracking-widest text-orange-600">
        What people say
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
        Customer Reviews
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-slate-600">
        Discover what customers value when exploring events
        and venues with EventNest.
      </p>
    </div>
  );
}