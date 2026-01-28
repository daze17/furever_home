"use client";

import {
  ArrowLeft,
  Award,
  Dog,
  Edit,
  Heart,
  Home,
  Plus,
  Shield,
  Stethoscope,
  Syringe,
  Trash2,
  Users,
  Utensils,
  Zap,
} from "lucide-react";

import { OwnPetResponseBody } from "customer_api";
import Link from "next/link";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui";

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

export const MyPetDetails: React.FC<{
  petDetail: OwnPetResponseBody;
}> = ({ petDetail }) => {
  const pet = petDetail;

  const petAge = pet.birth_date
    ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear()
    : null;

  const statusLabel = {
    adopting: "Үрчлүүлэх",
    has_owner: "Эзэнтэй",
    inactive: "Идэвхгүй",
  };

  const statusColors = {
    adopting: "bg-green-100 text-green-800",
    has_owner: "bg-blue-100 text-blue-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/my_pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Миний тэжээвэр амьтад руу буцах
          </Link>
        </Button>

        {/* Owner Actions - Edit and Delete buttons */}
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/my_pets/${pet.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Засах
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Устгах
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <ImageWithFallback
                src={"/furever-home-dog.jpg"}
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

          {/* Medical Records Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Эмнэлгийн бүртгэл
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/my_pets/${pet.id}/medical_records`}>
                    {pet.pet_medical_records ? (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Засах
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Нэмэх
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pet.pet_medical_records ? (
                <div className="space-y-4">
                  {/* Spayed/Neutered Status */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Үржил хязгаарласан эсэх
                      </p>
                      <Badge
                        className={`mt-1 ${
                          pet.pet_medical_records.is_spayed_neutered
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pet.pet_medical_records.is_spayed_neutered
                          ? "Тийм"
                          : "Үгүй"}
                      </Badge>
                    </div>
                  </div>

                  {/* Medical Notes */}
                  {pet.pet_medical_records.medical_notes && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Эмнэлгийн тэмдэглэл
                        </p>
                        <p className="mt-1 text-gray-700">
                          {pet.pet_medical_records.medical_notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Allergies */}
                  {pet.pet_medical_records.allergies && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Харшил
                        </p>
                        <p className="mt-1 text-gray-700">
                          {pet.pet_medical_records.allergies}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Vaccinations Table */}
                  {pet.pet_medical_records.vaccinations.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Вакцинжуулалт
                        </p>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Нэр</TableHead>
                            <TableHead>Огноо</TableHead>
                            <TableHead>Тэмдэглэл</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pet.pet_medical_records.vaccinations.map(
                            (vaccination) => (
                              <TableRow key={vaccination.id}>
                                <TableCell className="font-medium">
                                  {vaccination.name}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    vaccination.date,
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {vaccination.notes || "-"}
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Эмнэлгийн бүртгэл байхгүй байна. Нэмэх товч дээр дарж
                  бүртгэл үүсгэнэ үү.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
