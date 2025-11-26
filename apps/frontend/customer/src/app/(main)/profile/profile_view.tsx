"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import type { CustomerProfileResponseBody } from "customer_api";
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

import { client } from "@/services/client";

export function ProfileView() {
  const [profile, setProfile] = useState<CustomerProfileResponseBody | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.customer.getCustomerProfile();

      if (response.status === 200) {
        setProfile(response.body);
      } else if (response.status === 400) {
        setError("Unable to load profile. Please try again.");
      } else if (response.status === 404) {
        setError("Profile not found");
      } else {
        setError("An error occurred while loading your profile");
      }
    } catch (err) {
      setError("An error occurred while loading your profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error || "Profile not found"}
        </div>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  // Generate avatar initials
  const getInitials = () => {
    const firstInitial = profile.first_name?.[0] || "";
    const lastInitial = profile.last_name?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase() || "?";
  };

  // Format display name
  const displayName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ") || "User";

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
            <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold">{displayName}</h1>
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
            <span className="text-sm font-medium font-mono">
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
}
