"use client";

import { HeartOff } from "lucide-react";
import { startTransition, useState } from "react";

import { useRouter } from "next/navigation";

import { Button, toast } from "ui";

import { client } from "@/services/client";

export const FavoriteRemoveButton = ({ postId }: { postId: number }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    try {
      const response = await client.adoptionPosts.removeFavoriteAdoptionPost({
        params: {
          id: postId,
        },
      });
      switch (response.status) {
        case 204:
          toast.success("Амжилттай устгалаа");
          setIsPending(false);
          startTransition(() => {
            router.refresh();
          });
          break;
        case 400:
          toast.error("Буруу хүсэлт");
          setIsPending(false);
          break;
        default:
      }
    } catch (error) {
      console.log(error);
      toast.error("Алдаа", {
        description: "Тодорхойгүй алдаа гарлаа",
      });
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        handleRemove();
      }}
      disabled={isPending}
      className="text-gray-500 hover:bg-red-50 hover:text-red-600"
      title="Жагсаалтаас хасах"
    >
      <HeartOff className="h-4 w-4" />
    </Button>
  );
};
