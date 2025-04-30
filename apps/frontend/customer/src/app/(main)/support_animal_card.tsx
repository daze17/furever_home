import { Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "ui";

export const SupportAnimalCard: React.FC<{ animal: any }> = ({ animal }) => {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mt-2 text-2xl font-bold">{animal.name}</h3>
      <p className="text-sm text-gray-600">2 настай</p>
      <div className="relative h-44 w-full">
        <Image
          src={animal.petImage.startsWith("/") ? animal.petImage : "/logo.svg"}
          alt={animal.name}
          className="w-full rounded-t-lg object-cover"
          fill
        />
      </div>
      <div className="py-4">
        <div className="flex gap-2">
          <span className="rounded-full bg-gray-200 px-2 py-1 text-sm">
            🐶 Нохой
          </span>
          <span className="rounded-full bg-gray-200 px-2 py-1 text-sm">
            📍 Улаанбаатар
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Poppy ni lorem ipsum dolor sit amet consectetur adipisicing elit.
          Dolorum, doloremque
        </p>
        <Button
          variant="secondary"
          className="mt-4 w-full rounded-full bg-secondary py-2 text-white shadow-sm hover:bg-secondary-foreground"
        >
          Туслах
          <Heart className="ml-2 h-4 w-4" fill="white" />
        </Button>
      </div>
    </div>
  );
};
