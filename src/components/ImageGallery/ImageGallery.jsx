import { useMemo, useState } from "react";

import GalleryHeading from "./GalleryHeading";
import GalleryFilters from "./GalleryFilters";
import GalleryCarousel from "./GalleryCarousel";
import GalleryPreviewModal from "./GalleryPreviewModal";
import GalleryPaginationStyles from "./GalleryPaginationStyles";

import { galleryImages } from "./galleryData";

export default function ImageGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") {
      return galleryImages;
    }

    return galleryImages.filter(
      (image) => image.category === activeCategory
    );
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSelectedImage(null);
  };

  return (
    <>
      <section
        id="gallery"
        className="eventnest-section overflow-hidden px-5 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          {/* Gallery heading */}
          <GalleryHeading />

          {/* Category filters */}
          <GalleryFilters
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Gallery carousel */}
          <GalleryCarousel
            images={filteredImages}
            activeCategory={activeCategory}
            onSelectImage={setSelectedImage}
          />

          {/* Image count */}
          <p className="mt-1 text-center text-sm text-slate-500">
            {filteredImages.length} photos · Swipe or use the arrows to
            explore
          </p>
        </div>

        {/* Orange Swiper pagination dots */}
        <GalleryPaginationStyles />
      </section>

      {/* Full-screen image preview */}
      <GalleryPreviewModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}