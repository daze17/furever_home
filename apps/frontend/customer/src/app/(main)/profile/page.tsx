import { ProfileView } from "./profile_view";

export const revalidate = 0;

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileView />
    </div>
  );
}
