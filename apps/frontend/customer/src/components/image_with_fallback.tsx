"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  alt: string;
  fallbackSrc: string;
}

const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== "string" || url.trim() === "") return false;
  // Check if it's a valid URL or path
  try {
    // Check if it's an absolute URL
    new URL(url);
    return true;
  } catch {
    // Check if it's a valid path starting with /
    return url.startsWith("/");
  }
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
  const { alt, src, fallbackSrc, ...rest } = props;
  // Use fallback immediately if src is invalid
  const initialSrc = isValidUrl(src) ? (src as string) : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
};

export default ImageWithFallback;
