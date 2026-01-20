"use client";

import { useState } from "react";

import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import dynamic from "next/dynamic";

const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  { ssr: false },
);

const CldImage = dynamic(
  () => import("@/components/cld_image").then((mod) => mod.CldImage),
  { ssr: false },
);

const ImageUploadPage = () => {
  const [resource, setResource] = useState<CloudinaryUploadWidgetInfo>();

  return (
    <div>
      <CldUploadWidget
        options={{ sources: ["local"] }}
        signatureEndpoint="/api/sign_cloudinary_params"
        onSuccess={(result, { widget }) => {
          setResource(result?.info as CloudinaryUploadWidgetInfo); // { public_id, secure_url, etc }
        }}
        onQueuesEnd={(result, { widget }) => {
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(undefined);
            open();
          }
          return <button onClick={handleOnClick}>Upload an Image</button>;
        }}
      </CldUploadWidget>
      {resource && (
        <CldImage
          src={resource.public_id}
          alt="image"
          width={200}
          height={200}
        />
      )}
    </div>
  );
};
export default ImageUploadPage;
