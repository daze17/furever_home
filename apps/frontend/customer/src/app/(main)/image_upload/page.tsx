"use client";

import dynamic from "next/dynamic";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useState } from "react";

const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  { ssr: false }
);

const CldImage = dynamic(
  () => import("@/components/cld_image").then((mod) => mod.CldImage),
  { ssr: false }
);

const ImageUploadPage = () => {
  const [resource, setResource] = useState<CloudinaryUploadWidgetInfo>();

  return (
    <>
      <CldUploadWidget
        options={{ sources: ["local"] }}
        signatureEndpoint="/api/sign-cloudinary-params"
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
    </>
  );
};
export default ImageUploadPage;
