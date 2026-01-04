"use client";

import { HeartIcon } from "lucide-react";
import { startTransition, useState } from "react";

import { useRouter } from "next/navigation";

import { Button, toast } from "ui";

import { client } from "@/services/client";

export const FavoriteAddButton = ({ postId }: { postId: number }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleButton = async () => {
    try {
      const response = await client.adoptionPosts.addFavoriteAdoptionPost({
        params: {
          id: postId,
        },
        body: {},
      });
      switch (response.status) {
        case 201:
          toast.success("Амжилттай");
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
      onClick={handleButton}
      disabled={isPending}
      className="text-gray-500 hover:bg-red-50 hover:text-red-600"
      title="Жагсаалтад нэмэх"
    >
      <HeartIcon className="h-4 w-4 text-gray-400" />
    </Button>
  );
};
