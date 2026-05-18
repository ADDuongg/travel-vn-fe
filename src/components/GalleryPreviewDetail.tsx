import { AiOutlineVideoCamera } from 'react-icons/ai';
import { BsImages } from 'react-icons/bs';

export function GalleryPreviewDetail({
  gallery,
  thumbnail,
  overlayLabel,
}: {
  gallery: {
    _id: string;
    url: string;
    alt?: string;
    order?: number;
  }[];
  thumbnail?: {
    _id: string;
    url: string;
    alt?: string;
  };

  overlayLabel?: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {}
      <div className="relative col-span-12 md:col-span-8 rounded-xl overflow-hidden ring-1 ring-border aspect-[16/9]">
        <img
          src={thumbnail?.url ?? gallery[0]?.url}
          alt={thumbnail?.alt ?? gallery[0]?.alt}
          className="w-full h-full object-cover"
        />
        {overlayLabel && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm font-medium px-3 py-2 rounded-md">
            {overlayLabel}
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <BsImages size={20} />
            <span>Gallery</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <AiOutlineVideoCamera size={20} />
            <span>Video</span>
          </button>
        </div>
      </div>

      {}
      <div className="col-span-12 md:col-span-4 grid grid-cols-2 grid-rows-2 gap-4">
        {gallery.slice(1).map((img) => (
          <div
            key={img._id}
            className="rounded-xl overflow-hidden ring-1 ring-border"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

