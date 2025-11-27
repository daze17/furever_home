import { Suspense } from "react";
import { LoginForm } from "./login_form";

const AdminLoginPage: React.Page = () => {
  return (
    <main className="flex h-[calc(100dvh-190px)] w-full items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
};

export default AdminLoginPage;
