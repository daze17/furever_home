"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { Button, toast } from "ui";

import { useFavorites } from "@/contexts/favorites";

type Props = {
  petId: number;
  petName: string;
  variant?: "icon" | "button";
  className?: string;
};

export const FavoriteButton: React.FC<Props> = ({
  petId,
  petName,
  variant = "icon",
  className,
}) => {
  const { isFavorited, addFavorite, removeFavorite, isLoading } = useFavorites();
  const [isPending, setIsPending] = useState(false);

  const favorited = isFavorited(petId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPending(true);

    try {
      if (favorited) {
        const success = await removeFavorite(petId);
        if (success) {
          toast.success(`${petName} дуртай жагсаалтаас хасагдлаа`);
        } else {
          toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
        }
      } else {
        const success = await addFavorite(petId);
        if (success) {
          toast.success(`${petName} дуртай жагсаалтруу нэмэгдлээ`);
        } else {
          toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
        }
      }
    } catch {
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsPending(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending || isLoading}
        className={className}
        title={favorited ? "Дуртайгаас хасах" : "Дуртайд нэмэх"}
      >
        <Heart
          className="h-5 w-5 shrink-0 transition-transform duration-200 hover:scale-110"
          fill={favorited ? "#11D0BC" : "none"}
          stroke={favorited ? "#11D0BC" : "currentColor"}
        />
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending || isLoading}
      variant="outline"
      size="lg"
      className={className}
    >
      <Heart
        className="mr-2 h-4 w-4"
        fill={favorited ? "#11D0BC" : "none"}
        stroke={favorited ? "#11D0BC" : "currentColor"}
      />
      {favorited ? "Дуртайгаас хасах" : "Дуртайд нэмэх"}
    </Button>
  );
};
