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
            Нүүр хуудас
          </Link>
        </Button>
        <Button asChild>
          <Link href="/profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Засах
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
            {profile.nickname ? `"${profile.nickname}"` : "Мэдээлэл байхгүй"}
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
            <CardTitle>Хувийн мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Нэр</p>
              <p className="mt-1">{profile.first_name || "Мэдээлэл байхгүй"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Овог</p>
              <p className="mt-1">{profile.last_name || "Мэдээлэл байхгүй"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Хоч</p>
              <p className="mt-1">{profile.nickname || "Мэдээлэл байхгүй"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Хүйс</p>
              <p className="mt-1 capitalize">
                {profile.gender || "Мэдээлэл байхгүй"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Холбоо барих</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Утас</p>
              <p className="mt-1">{profile.phone || "Мэдээлэл байхгүй"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Хаяг</p>
              <p className="mt-1">{profile.address || "Мэдээлэл байхгүй"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Шуудангийн код</p>
              <p className="mt-1">{profile.zip_code || "Мэдээлэл байхгүй"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Бүртгэлийн мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Бүртгэлийн ID:</span>
            <span className="font-mono text-sm font-medium">
              {profile.id.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Бүртгүүлсэн:</span>
            <span className="text-sm font-medium">
              {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Сүүлд шинэчилсэн:</span>
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
