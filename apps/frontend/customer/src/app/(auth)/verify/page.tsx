import { redirect } from "next/navigation";

interface Props {
  searchParams: { token?: string };
}

const VerifyPage: React.Page<Props> = async props => {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    // No token provided, redirect to register
    redirect("/register");
  }

  // Redirect to the password creation page with the token
  redirect(`/register/verify?token=${token}`);
};

export default VerifyPage;
