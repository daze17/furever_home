"use client";

import {
  ArrowLeft,
  Award,
  Dog,
  Edit,
  Heart,
  Home,
  MapPin,
  Phone,
  Trash2,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import { OwnAdoptionPostResponseBody } from "customer_api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "ui";

import ImageWithFallback from "@/components/image_with_fallback";
import {
  energyLevelColors,
  energyLevelLabels,
  friendlinessColors,
  friendlinessLabels,
  speciesEmoji,
  trainingLevelColors,
  trainingLevelLabels,
} from "@/utils";
import { client } from "@/services/client";

export const AdoptionPostDetails: React.FC<{
  post: OwnAdoptionPostResponseBody;
}> = ({ post }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const pet = post.pet;

  const petAge = pet.birth_date
    ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear()
    : null;

  const statusLabel = {
    active: "Идэвхтэй",
    inactive: "Идэвхгүй",
    pending: "Хүлээгдэж буй",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  const primaryImage =
    pet.images?.find((img) => img.is_primary)?.image_url ||
    pet.images?.[0]?.image_url ||
    "/furever-home-dog.jpg";

  const handleDelete = async () => {
    if (!window.confirm(`Та "${pet.name}"-н үрчлүүлэх зарыг устгахдаа итгэлтэй байна уу?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await client.adoptionPosts.deleteAdoptionPost({
        params: { id: post.id },
      });

      if (response.status === 204) {
        router.push("/adoptions");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete adoption post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/adoptions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Үрчлүүлэх зарууд руу буцах
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/adoptions/${post.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Засах
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Устгаж байна..." : "Устгах"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <ImageWithFallback
                src={primaryImage}
                alt={pet.name}
                height={400}
                width={400}
                fallbackSrc="/furever-home-dog.jpg"
                className="h-[400px] w-full rounded-lg object-cover"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {/* Pet Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl">{pet.name}</CardTitle>
                  {petAge !== null && (
                    <p className="mt-1 text-lg text-muted-foreground">
                      {petAge} настай
                    </p>
                  )}
                </div>
                <Badge className={statusColors[post.post_status]}>
                  {statusLabel[post.post_status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Төрөл
                  </p>
                  <p className="mt-1 text-lg">
                    {speciesEmoji[pet.species]} {pet.species}
                  </p>
                </div>

                {pet.size && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Хэмжээ
                    </p>
                    <p className="mt-1 text-lg capitalize">{pet.size}</p>
                  </div>
                )}

                {pet.birth_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Төрсөн огноо
                    </p>
                    <p className="mt-1">
                      {new Date(pet.birth_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Adoption Post Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Зарын мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.price !== null && post.price !== undefined && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <span className="text-blue-600">₮</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Үнэ
                    </p>
                    <p className="text-lg font-semibold">
                      ₮{post.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {post.address && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Хаяг
                    </p>
                    <p className="text-gray-700">{post.address}</p>
                  </div>
                </div>
              )}

              {post.contact && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Холбоо барих
                    </p>
                    <p className="text-gray-700">{post.contact}</p>
                  </div>
                </div>
              )}

              {post.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Нэмэлт тайлбар
                  </p>
                  <p className="mt-1 text-gray-700">{post.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Behavioral Information Card */}
          {pet.pet_extra_information && (
            <Card>
              <CardHeader>
                <CardTitle>Зан төлөвийн мэдээлэл</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Energy Level */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Эрч хүчний түвшин
                      </p>
                      {pet.pet_extra_information.energy_level ? (
                        <Badge
                          className={`mt-1 ${energyLevelColors[pet.pet_extra_information.energy_level]}`}
                        >
                          {
                            energyLevelLabels[
                              pet.pet_extra_information.energy_level
                            ]
                          }
                        </Badge>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Тодорхойлоогүй
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Friendliness with Children */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Хүүхэдтэй найрсаг байдал
                      </p>
                      {pet.pet_extra_information.friendliness_with_children ? (
                        <Badge
                          className={`mt-1 ${friendlinessColors[pet.pet_extra_information.friendliness_with_children]}`}
                        >
                          {
                            friendlinessLabels[
                              pet.pet_extra_information.friendliness_with_children
                            ]
                          }
                        </Badge>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Тодорхойлоогүй
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Friendliness with Pets */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Dog className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Бусад амьтантай найрсаг байдал
                      </p>
                      {pet.pet_extra_information.friendliness_with_pets ? (
                        <Badge
                          className={`mt-1 ${friendlinessColors[pet.pet_extra_information.friendliness_with_pets]}`}
                        >
                          {
                            friendlinessLabels[
                              pet.pet_extra_information.friendliness_with_pets
                            ]
                          }
                        </Badge>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Тодорхойлоогүй
                        </p>
                      )}
                    </div>
                  </div>

                  {/* House Trained */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Гэрийн сургалттай
                      </p>
                      {pet.pet_extra_information.is_house_trained !== null ? (
                        <Badge
                          className={`mt-1 ${
                            pet.pet_extra_information.is_house_trained
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {pet.pet_extra_information.is_house_trained
                            ? "Тийм"
                            : "Үгүй"}
                        </Badge>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Тодорхойлоогүй
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Training Level */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Сургалтын түвшин
                      </p>
                      {pet.pet_extra_information.training_level ? (
                        <Badge
                          className={`mt-1 ${trainingLevelColors[pet.pet_extra_information.training_level]}`}
                        >
                          {
                            trainingLevelLabels[
                              pet.pet_extra_information.training_level
                            ]
                          }
                        </Badge>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Тодорхойлоогүй
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details Card */}
          {pet.pet_extra_information &&
            (pet.pet_extra_information.special_needs ||
              pet.pet_extra_information.dietary_restrictions) && (
              <Card>
                <CardHeader>
                  <CardTitle>Нэмэлт дэлгэрэнгүй</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pet.pet_extra_information.special_needs && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Онцгой хэрэгцээ
                        </p>
                        <p className="mt-1 text-gray-700">
                          {pet.pet_extra_information.special_needs}
                        </p>
                      </div>
                    </div>
                  )}

                  {pet.pet_extra_information.dietary_restrictions && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Utensils className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Хоолны хязгаарлалт
                        </p>
                        <p className="mt-1 text-gray-700">
                          {pet.pet_extra_information.dietary_restrictions}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
};
