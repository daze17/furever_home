"use client";

import { useEffect, useState } from "react";

import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";

import { cn } from "utils";

type ImagePreviewProps = {
  imageUrl: string | null | undefined;
  size?: number;
  className?: string;
  onClick?: () => void;
  isUploading?: boolean;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  size = 96,
  className,
  onClick,
  isUploading = false,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const isClickable = !!onClick && !isUploading;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border-2 border-muted bg-muted",
        isClickable && "cursor-pointer",
        className,
      )}
      style={{ width: size, height: size }}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt="Preview"
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User className="h-1/2 w-1/2 text-muted-foreground" />
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-1/3 w-1/3 animate-spin text-white" />
        </div>
      )}

      {isClickable && !isUploading && (
        <div className="group absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/40">
          <Camera className="h-1/3 w-1/3 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
