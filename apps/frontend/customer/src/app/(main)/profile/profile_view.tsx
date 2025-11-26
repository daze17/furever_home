import { ArrowLeft, Edit } from "lucide-react";

import type { CustomerProfileResponseBody } from "customer_api";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "ui";

const ProfileView: React.FC<{
  profileData: CustomerProfileResponseBody;
}> = (data) => {
  const profile = data.profileData;
  // Generate avatar initials
  const getInitials = () => {
    const firstInitial = profile.first_name?.[0] || "";
    const lastInitial = profile.last_name?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase() || "?";
  };
  // Format display name
  return (
    <div>
      {/* Header with Back and Edit buttons */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild>
          <Link href="/profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="flex flex-col items-center pt-6">
          <Avatar className="h-24 w-24 border-2">
            <AvatarImage src={profile.profile_image_url || ""} />
            <AvatarFallback className="text-2xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold">
            {[profile.first_name, profile.last_name].join(" ")}
          </h1>
          <p className="text-sm text-gray-500">
            {profile.nickname ? `"${profile.nickname}"` : "Not provided"}
          </p>
          {profile.gender && (
            <span className="mt-2 rounded-full bg-gray-100 px-3 py-1 text-sm capitalize text-gray-700">
              {profile.gender}
            </span>
          )}
        </CardContent>
      </Card>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">First Name</p>
              <p className="mt-1">{profile.first_name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Name</p>
              <p className="mt-1">{profile.last_name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nickname</p>
              <p className="mt-1">{profile.nickname || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="mt-1 capitalize">
                {profile.gender || "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="mt-1">{profile.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="mt-1">{profile.address || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Zip Code</p>
              <p className="mt-1">{profile.zip_code || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Account ID:</span>
            <span className="font-mono text-sm font-medium">
              {profile.id.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Member Since:</span>
            <span className="text-sm font-medium">
              {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Last Updated:</span>
            <span className="text-sm font-medium">
              {new Date(profile.updated_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
