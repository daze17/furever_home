import { redirect } from "next/navigation";

import { ResetPasswordForm } from "./reset_password_form";

interface Props {
  searchParams: Promise<{ token?: string | string[] }>;
}

const ResetPasswordPage: React.Page<Props> = async props => {
  const searchParams = await props.searchParams;
  const token = Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <main className="flex h-[calc(100dvh-190px)] w-full items-center justify-center">
      <ResetPasswordForm token={token} />
    </main>
  );
};

export default ResetPasswordPage;
