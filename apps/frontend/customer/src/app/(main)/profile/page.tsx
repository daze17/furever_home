import { client } from "@/services/client.server";

import ProfileView from "./profile_view";

const ProfilePage: React.Page = async () => {
  const response = await client.customer.getCustomerProfile();
  if (response.status !== 200) {
    return <div>error</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileView profileData={response.body} />
    </div>
  );
};

export default ProfilePage;
