import { LoginForm } from "./login_form";

const AdminLoginPage: React.Page = () => {
  return (
    <main className="flex h-[calc(100dvh-190px)] w-full items-center justify-center">
      <LoginForm />
    </main>
  );
};

export default AdminLoginPage;
