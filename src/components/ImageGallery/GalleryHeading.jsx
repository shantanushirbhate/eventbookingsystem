import { Images } from "lucide-react";

export default function GalleryHeading() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-orange-600">
        <Images size={25} />
      </div>

      <p className="mt-4 text-sm font-bold uppercase tracking-widest text-orange-600">
        Moments worth remembering
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
        Event Gallery
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-slate-600">
        Explore beautiful celebrations, memorable events, and stunning
        event spaces.
      </p>
    </div>
  );
}