"use client";

import { AdoptionPostsListResponseBody } from "customer_api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";

import { FavoriteFilters } from "./favorite_filters";
import { FavoritesTable } from "./favorites_table";

type PaginationMeta = {
  total: number;
  per_page: number;
  current_page: number;
};

const FavoritesList: React.FC<{
  adoptionPosts: AdoptionPostsListResponseBody;
  meta: PaginationMeta;
  pagination: React.ReactNode;
}> = ({ adoptionPosts, meta, pagination }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-80 shrink-0 border-r bg-white shadow-sm">
          <FavoriteFilters />
        </aside>

        <div className="flex-1">
          <div className="sticky top-0 z-10 h-16 border-b bg-white px-6 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Нийт{" "}
                <span className="font-semibold text-gray-900">
                  {meta.total}
                </span>{" "}
                дуртай тэжээвэр амьтнаас{" "}
                <span className="font-semibold text-gray-900">
                  {adoptionPosts.length}
                </span>{" "}
                харуулж байна
              </p>
              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-44 border-gray-200 bg-white">
                    <SelectValue placeholder="Эрэмбэлэх" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Шинэ нь эхэндээ</SelectItem>
                    <SelectItem value="oldest">Хуучин нь эхэндээ</SelectItem>
                    <SelectItem value="name_asc">Нэр А-Я</SelectItem>
                    <SelectItem value="name_desc">Нэр Я-А</SelectItem>
                  </SelectContent>
                </Select>
                {pagination}
              </div>
            </div>
          </div>

          <div className="p-6">
            {adoptionPosts.length > 0 ? (
              <FavoritesTable posts={adoptionPosts} />
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-3xl">💔</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Дуртай тэжээвэр амьтан олдсонгүй
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Та тэжээвэр амьтад хуудаснаас зүрхэн дээр дарж нэмнэ үү
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesList;
