import { CrossIcon } from "lucide-react";
import Image from "next/image";

export default function ImageViewComponent({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-scroll"
      onClick={onClose} // clicking outside closes modal
    >
      <div
        className="relative w-[90%] max-w-3xl max-h-[80vh]  p-4 "
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
      >
        <Image
          src={imageUrl}
          alt="Image"
          width={800} 
          height={600} 
          className="object-contain object-center border-amber-400"
          unoptimized // for external urlss
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black px-2 py-1 flex gap-2  rounded"
        > 
        <CrossIcon className="rotate-45"/>
          Close
        </button>
      </div>
    </div>
  );
}

