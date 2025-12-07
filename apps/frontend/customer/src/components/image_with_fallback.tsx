"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps extends ImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
}

const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return false;
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
  const initialSrc = isValidUrl(src) ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        console.log("error");
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
