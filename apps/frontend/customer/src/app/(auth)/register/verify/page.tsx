import { ServerError } from "@/components/server_error";

import ProfileCreateForm from "./profile_create_form";

interface Props {
  searchParams: { token: string };
}
const RegisterVerifyPage: React.FC<Props> = async (props) => {
  const searchParams = await props.searchParams;
  if (!searchParams.token) return <ServerError message={`Токен буруу байна`} />;

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <ProfileCreateForm token={searchParams.token} />
    </div>
  );
};
export default RegisterVerifyPage;
