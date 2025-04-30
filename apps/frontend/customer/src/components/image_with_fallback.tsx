"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps extends ImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
  const { alt, src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

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
