import { ArrowUpRight } from "lucide-react";

export default function FooterGetStarted() {
  return (
    <div>
      <h3 className="font-semibold text-white">Get Started</h3>

      <p className="mt-5 text-sm leading-6 text-gray-400">
        Looking for a venue for your next event?
      </p>

      <a
        href="#venues"
        className="group mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-95"
      >
        Find a Venue

        <ArrowUpRight
          size={17}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </a>
    </div>
  );
}