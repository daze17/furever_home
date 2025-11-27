import { redirect } from "next/navigation";

import { ResetPasswordForm } from "./reset_password_form";

interface Props {
  searchParams: { token?: string };
}

const ResetPasswordPage: React.Page<Props> = async ({ searchParams }) => {
  if (!searchParams.token) {
    redirect("/forgot-password");
  }

  return (
    <main className="flex h-[calc(100dvh-190px)] w-full items-center justify-center">
      <ResetPasswordForm token={searchParams.token} />
    </main>
  );
};

export default ResetPasswordPage;
