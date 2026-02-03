"use client";

import { useState } from "react";
import { PetImageModel } from "customer_api";
import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "ui";
import ImageWithFallback from "@/components/image_with_fallback";

interface PetImageCarouselProps {
  images: PetImageModel[];
  petName: string;
}

export const PetImageCarousel: React.FC<PetImageCarouselProps> = ({
  images,
  petName,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Empty state - no images
  if (!images || images.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-muted">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Зураг байхгүй байна
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Энэ амьтны зураг одоогоор нэмэгдээгүй байна
          </p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedImageIndex];

  return (
    <div className="w-full space-y-4">
      {/* Main Image Display */}
      <div className="relative">
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogTrigger asChild>
            <button className="group relative w-full cursor-pointer overflow-hidden rounded-lg">
              <ImageWithFallback
                src={currentImage.image_url}
                alt={`${petName}`}
                height={400}
                width={400}
                fallbackSrc="/furever-home-dog.jpg"
                className="h-[400px] w-full rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
              />
              {/* Zoom icon overlay */}
              <div className="absolute bottom-4 right-4 rounded-full bg-white p-2 shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Expand className="h-5 w-5 text-gray-700" />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogTitle className="sr-only">
              {petName} - Том зураг {selectedImageIndex + 1}
            </DialogTitle>
            <ImageWithFallback
              src={currentImage.image_url}
              alt={`${petName} - Том зураг ${selectedImageIndex + 1}`}
              height={800}
              width={800}
              fallbackSrc="/furever-home-dog.jpg"
              className="h-auto w-full rounded-lg object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                index === selectedImageIndex
                  ? "border-[#11D0BC] ring-2 ring-[#11D0BC] ring-opacity-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <ImageWithFallback
                src={image.image_url}
                alt={`${petName} thumbnail ${index + 1}`}
                height={80}
                width={80}
                fallbackSrc="/furever-home-dog.jpg"
                className={`h-20 w-20 object-cover transition-opacity duration-200 ${
                  index === selectedImageIndex ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          {selectedImageIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};
