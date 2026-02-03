"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ImageUploadStep } from "./image-upload-step";
import { PetDetailsForm } from "./pet-details-form";

interface UploadedImage {
  url: string;
  preview: string;
}

export function NewPetForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const router = useRouter();

  const handleImagesUploaded = (images: UploadedImage[]) => {
    setUploadedImages(images);
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSuccess = () => {
    router.push("/my_pets");
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step === 1
              ? "bg-[#11D0BC] text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          1
        </div>
        <div className="h-1 w-16 bg-gray-200">
          <div
            className={`h-full bg-[#11D0BC] transition-all ${
              step === 2 ? "w-full" : "w-0"
            }`}
          />
        </div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step === 2
              ? "bg-[#11D0BC] text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          2
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-medium">
          {step === 1 ? "Зураг оруулах" : "Мэдээлэл оруулах"}
        </h2>
        <p className="text-sm text-gray-500">
          {step === 1
            ? "Тэжээвэр амьтныхаа зургуудыг оруулна уу"
            : "Тэжээвэр амьтныхаа мэдээллийг оруулна уу"}
        </p>
      </div>

      {/* Step 1: Image Upload */}
      {step === 1 && (
        <ImageUploadStep
          uploadedImages={uploadedImages}
          onImagesUploaded={handleImagesUploaded}
          onContinue={handleContinue}
        />
      )}

      {/* Step 2: Pet Details Form */}
      {step === 2 && (
        <PetDetailsForm
          uploadedImages={uploadedImages}
          onBack={handleBack}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
