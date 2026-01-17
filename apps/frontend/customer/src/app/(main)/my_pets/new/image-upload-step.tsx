"use client";

import { ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

import Image from "next/image";

import { Button, Card, CardContent, toast } from "ui";
import { cn } from "utils";

import { client } from "@/services/client";

interface ImagePreview {
  file: File;
  preview: string;
}

interface UploadedImage {
  url: string;
  preview: string;
}

interface ImageUploadStepProps {
  uploadedImages: UploadedImage[];
  onImagesUploaded: (images: UploadedImage[]) => void;
  onContinue: () => void;
}

export function ImageUploadStep({
  uploadedImages,
  onImagesUploaded,
  onContinue,
}: ImageUploadStepProps) {
  const [pendingImages, setPendingImages] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImagePreview[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newImages.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setPendingImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePendingImage = (index: number) => {
    setPendingImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const removeUploadedImage = (index: number) => {
    // Create a new array without the removed image and notify parent
    const newUploadedImages = [...uploadedImages];
    newUploadedImages.splice(index, 1);
    onImagesUploaded(newUploadedImages);
  };

  const uploadImages = async () => {
    if (pendingImages.length === 0) {
      onContinue();
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      pendingImages.forEach((img) => {
        formData.append("files", img.file);
      });

      const response = await client.pets.uploadPetImages({
        body: formData,
      });

      if (response.status !== 201) {
        throw new Error("Upload failed");
      }

      const urls = response.body;

      // Map URLs to uploaded images with previews
      const newUploadedImages = urls.map((url, index) => ({
        url,
        preview: pendingImages[index].preview,
      }));

      // Combine with existing uploaded images
      const allUploadedImages = [...uploadedImages, ...newUploadedImages];
      onImagesUploaded(allUploadedImages);
      setPendingImages([]);

      toast.success("Амжилттай", {
        description: "Зургууд амжилттай байршуулагдлаа",
      });

      // Continue to next step
      onContinue();
    } catch (error) {
      toast.error("Алдаа", {
        description: "Зураг байршуулж чадсангүй",
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const totalImages = pendingImages.length + uploadedImages.length;

  return (
    <Card>
      <CardContent className="pt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Image grid */}

          <div className="flex w-full justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex aspect-square h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors",
                "hover:border-gray-400",
              )}
            >
              <div className="text-center">
                <ImagePlus className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm text-gray-500">
                  Зураг нэмэх
                </span>
              </div>
            </button>
          </div>
          <div
            className={cn(
              "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4",
            )}
          >
            {uploadedImages.map((img, index) => (
              <div
                key={`uploaded-${index}`}
                className="group relative aspect-square"
              >
                <Image
                  src={img.preview}
                  alt={`Uploaded ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover ring-2 ring-green-500"
                  width={100}
                  height={100}
                />
                <button
                  type="button"
                  onClick={() => removeUploadedImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-green-500 px-2 py-0.5 text-xs text-white">
                    Үндсэн
                  </span>
                )}
              </div>
            ))}

            {pendingImages.map((img, index) => (
              <div
                key={`pending-${index}`}
                className="group relative aspect-square"
              >
                <Image
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover opacity-70"
                  width={100}
                  height={100}
                />
                <Button
                  type="button"
                  onClick={() => removePendingImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
                <span className="absolute bottom-1 left-1 rounded bg-yellow-500 px-2 py-0.5 text-xs text-white">
                  Хүлээгдэж буй
                </span>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            Эхний зураг үндсэн зураг болно. Нийт {totalImages} зураг сонгогдсон.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={uploadImages}
            disabled={isUploading}
            className="bg-[#11D0BC] hover:bg-[#0fb8a6]"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Байршуулж байна...
              </>
            ) : (
              <>
                Үргэлжлүүлэх
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
