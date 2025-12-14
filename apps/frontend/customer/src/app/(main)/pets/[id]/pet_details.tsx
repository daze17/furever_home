"use client";

import {
  ArrowLeft,
  Award,
  Dog,
  Heart,
  Home,
  Users,
  Utensils,
  Zap,
} from "lucide-react";

import { PetResponseBody } from "customer_api";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "ui";

import ImageWithFallback from "@/components/image_with_fallback";

const PetDetails: React.FC<{
  petDetail: PetResponseBody;
}> = ({ petDetail }) => {
  const router = useRouter();
  const pet = petDetail;

  const petAge = pet.birth_date
    ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear()
    : null;

  const speciesEmoji = {
    dog: "🐕",
    cat: "🐈",
    bird: "🐦",
    fish: "🐠",
    other: "🐾",
  };

  const statusLabel = {
    adopting: "Available for Adoption",
    has_owner: "Has Owner",
    inactive: "Inactive",
  };

  const statusColors = {
    adopting: "bg-green-100 text-green-800",
    has_owner: "bg-blue-100 text-blue-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  // Behavioral data labels and colors
  const energyLevelLabels = {
    low: "Low Energy",
    medium: "Medium Energy",
    high: "High Energy",
  };

  const energyLevelColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const friendlinessLabels = {
    poor: "Poor",
    fair: "Fair",
    good: "Good",
    excellent: "Excellent",
  };

  const friendlinessColors = {
    poor: "bg-red-100 text-red-800",
    fair: "bg-yellow-100 text-yellow-800",
    good: "bg-green-100 text-green-800",
    excellent: "bg-emerald-100 text-emerald-800",
  };

  const trainingLevelLabels = {
    none: "Not Trained",
    basic: "Basic Training",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  const trainingLevelColors = {
    none: "bg-gray-100 text-gray-800",
    basic: "bg-blue-100 text-blue-800",
    intermediate: "bg-green-100 text-green-800",
    advanced: "bg-emerald-100 text-emerald-800",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pets
          </Link>
        </Button>

        {/* Public action - Adoption button for non-owners */}
        {/*{!isOwner && pet?.pet_status === "adopting" && (*/}
        <Button asChild size="lg">
          <Link href={`/pets/${pet.id}/adopt`}>
            <Heart className="mr-2 h-4 w-4" />
            Adopt This Pet
          </Link>
        </Button>
        {/*)}*/}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <ImageWithFallback
                // TODO
                // src={pet.pet_image_url}
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
                      {petAge} years old
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
                    Species
                  </p>
                  <p className="mt-1 text-lg">
                    {speciesEmoji[pet.species]} {pet.species}
                  </p>
                </div>

                {pet.size && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Size
                    </p>
                    <p className="mt-1 text-lg capitalize">{pet.size}</p>
                  </div>
                )}

                {pet.birth_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Birth Date
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
                    Notes
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
                <CardTitle>Behavioral Information</CardTitle>
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
                        Energy Level
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
                          Not specified
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
                        Friendliness with Children
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
                          Not specified
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
                        Friendliness with Pets
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
                          Not specified
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
                        House Trained
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
                            ? "Yes"
                            : "No"}
                        </Badge>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Not specified
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
                        Training Level
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
                          Not specified
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
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pet.pet_extra_information.special_needs && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Special Needs
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
                          Dietary Restrictions
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

export default PetDetails;
