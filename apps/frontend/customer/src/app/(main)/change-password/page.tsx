import { ChangePasswordForm } from "./change_password_form";

const ChangePasswordPage: React.Page = () => {
  return (
    <main className="flex min-h-[calc(100dvh-190px)] w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ChangePasswordForm />
      </div>
    </main>
  );
};

export default ChangePasswordPage;
