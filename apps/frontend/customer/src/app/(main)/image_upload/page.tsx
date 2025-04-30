"use client";

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useState } from "react";

import { CldImage } from "@/components/cld_image";

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
