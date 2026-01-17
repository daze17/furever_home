import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { Button } from "ui";

import { client } from "@/services/client.server";

import ProfileEditForm from "./profile_edit_form";

const ProfileEditPage: React.Page = async () => {
  const response = await client.customer.getCustomerProfile();

  if (response.status === 400) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Хэрэглэгчийн мэдээлэл олдсонгүй</h1>
          <p className="text-muted-foreground">
            Энэ асуудал үргэлжилвэл тусламжийн төвтэй холбогдоно уу.
          </p>
        </div>
      </div>
    );
  }

  if (response.status !== 200) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Хэрэглэгчийн мэдээлэл ачааллахад алдаа гарлаа
          </h1>
          <p className="text-muted-foreground">Дахин оролдоно уу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Профайл засах</h1>
      </div>
      <ProfileEditForm initialProfile={response.body} />
    </div>
  );
};

export default ProfileEditPage;
