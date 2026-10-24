import { X } from "lucide-react";

export default function GalleryPreviewModal({
  selectedImage,
  onClose,
}) {
  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image preview"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
      >
        <X size={25} />
      </button>

      <div
        className="flex max-h-[90vh] max-w-5xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={selectedImage.image}
          alt={selectedImage.title}
          className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
        />

        <h3 className="mt-4 text-center text-lg font-bold text-white sm:text-xl">
          {selectedImage.title}
        </h3>

        <p className="mt-1 text-sm text-white/70">
          {selectedImage.category}
        </p>
      </div>
    </div>
  );
}