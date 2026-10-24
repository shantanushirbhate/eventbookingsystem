
import { MapPin } from "lucide-react";
import HeroCategories from "./HeroCategories";
import { heroCategories } from "./heroDataa";

export default function HeroContent() {
  return (
    <div className="max-w-2xl">
      {/* Animated Heading */}
      <h1 className="hero-heading text-4xl font-extrabold leading-[1.12] tracking-[-0.04em] text-white drop-shadow-md sm:text-5xl lg:text-6xl">
        Discover & Book
        <span className="mt-2 block italic text-amber-300">
          Amazing Events
        </span>
        <span className="mt-1 block">and Venues</span>
      </h1>

      {/* Animated Paragraph */}
      <p className="hero-paragraph mt-5 max-w-xl text-base leading-7 text-white drop-shadow-sm sm:text-lg">
        From beautiful weddings and birthday parties to corporate gatherings,
        concerts, and festivals, discover memorable experiences and the perfect
        venue for your special moments.
      </p>

      {/* Animated Categories */}
      <div className="hero-categories">
        <HeroCategories categories={heroCategories} />
      </div>

      {/* Animated Location */}
      <div className="hero-location mt-6 flex items-center gap-2 text-sm font-medium text-white drop-shadow-sm">
        <MapPin size={18} className="text-amber-300" />
        Explore events and venues in Amravati
      </div>

      {/* Entrance Animations */}
      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-heading {
          animation: heroFadeUp 0.9s ease-out both;
        }

        .hero-paragraph {
          opacity: 0;
          animation: heroFadeUp 0.9s ease-out 0.3s both;
        }

        .hero-categories {
          opacity: 0;
          animation: heroFadeUp 0.9s ease-out 0.55s both;
        }

        .hero-location {
          opacity: 0;
          animation: heroFadeUp 0.9s ease-out 0.75s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-heading,
          .hero-paragraph,
          .hero-categories,
          .hero-location {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
