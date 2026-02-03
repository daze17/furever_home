"use client";

import {
  ArrowLeft,
  Award,
  Dog,
  Heart,
  Home,
  MapPin,
  Phone,
  Users,
  Utensils,
  Zap,
} from "lucide-react";

import { AdoptionPostResponseBody } from "customer_api";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "ui";

import { FavoriteAddButton } from "@/components/favorite_add_button";
import { FavoriteRemoveButton } from "@/components/favorite_remove_button";
import ImageWithFallback from "@/components/image_with_fallback";
import {
  energyLevelColors,
  energyLevelLabels,
  friendlinessColors,
  friendlinessLabels,
  speciesEmoji,
  statusColors,
  statusLabel,
  trainingLevelColors,
  trainingLevelLabels,
} from "@/utils";

import { PetImageCarousel } from "./pet_image_carousel";

const AdoptionPostDetails: React.FC<{
  post: AdoptionPostResponseBody;
}> = ({ post }) => {
  const router = useRouter();
  const pet = post.pet;

  const petAge = pet.birth_date
    ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear()
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Тэжээвэр амьтад руу буцах
          </Link>
        </Button>

        {/* Public action - Favorite and Adoption buttons */}
        <div className="flex gap-2">
          {post.is_favorite ? (
            <FavoriteRemoveButton postId={post.id} />
          ) : (
            <FavoriteAddButton postId={post.id} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <PetImageCarousel images={pet.images || []} petName={pet.name} />
            </CardContent>
          </Card>

          {/* Price Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Үнэ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#11D0BC]">
                {post.price === null || post.price === 0
                  ? "Үнэгүй"
                  : `${post.price.toLocaleString()}₮`}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Холбоо барих</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {post.contact ? (
                <Button
                  className="w-full bg-[#11D0BC] hover:bg-[#0fb8a6]"
                  asChild
                >
                  <a href={`tel:${post.contact}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Залгах
                  </a>
                </Button>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Утасны дугаар бүртгэгдээгүй
                </p>
              )}
              {post.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{post.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
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
                <Badge className={statusColors[pet.pet_status]}>
                  {statusLabel[pet.pet_status]}
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

              {pet.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Тэмдэглэл
                  </p>
                  <p className="mt-1 text-gray-700">{pet.notes}</p>
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
                              pet.pet_extra_information
                                .friendliness_with_children
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
          {/*<Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pet ID:</span>
                <span className="text-sm font-medium">{pet.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm font-medium">
                  {new Date(pet.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Last Updated:
                </span>
                <span className="text-sm font-medium">
                  {new Date(pet.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>*/}
        </div>
      </div>
    </div>
  );
};

export default AdoptionPostDetails;
