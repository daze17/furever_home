import { ServerError } from "@/components/server_error";

import { PasswordCreateForm } from "./password_create_form";

interface Props {
  searchParams: { token: string };
}
const RegisterVerifyPage: React.FC<Props> = async props => {
  const searchParams = await props.searchParams;
  if (!searchParams.token) return <ServerError message={`Токен буруу байна`} />;

  return (
    <div className="flex h-[calc(100dvh-190px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <PasswordCreateForm token={searchParams.token} />
    </div>
  );
};
export default RegisterVerifyPage;
