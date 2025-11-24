import { CreateProfileForm } from "./create_profile_form";

const CreateProfilePage: React.Page = () => {
  return (
    <main className="flex min-h-[calc(100dvh-190px)] w-full items-center justify-center">
      <CreateProfileForm />
    </main>
  );
};

export default CreateProfilePage;
