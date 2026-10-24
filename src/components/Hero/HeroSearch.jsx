
import { Search, ArrowRight } from "lucide-react";

export default function HeroSearch({ onSearch }) {
  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSearch?.({
      search: formData.get("search") || "",
      date: "",
    });
  };

  return (
    <div className="w-full max-w-md justify-self-center rounded-2xl border border-white/50 bg-white/20 p-5 shadow-xl backdrop-blur-lg sm:p-6 lg:justify-self-end">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
        Start exploring
      </p>

      <p className="mt-2 text-sm leading-5 text-white/90">
        Search for events or venues for your next celebration.
      </p>

      <form onSubmit={handleSearch} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="hero-search"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Event, venue, or location
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/20 px-3 transition focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-300/40">
            <Search
              size={18}
              className="shrink-0 text-amber-100"
            />

            <input
              id="hero-search"
              name="search"
              type="search"
              placeholder="Wedding, Birthday, Amravati"
              className="w-full min-w-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/75"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-amber-300/50 active:scale-[0.99]"
        >
          Explore Events &amp; Venues
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="mt-4 text-center text-xs leading-5 text-white/80">
        Explore events and venues in Amravati, Maharashtra.
      </p>
    </div>
  );
}
