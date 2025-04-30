import { ArrowLeft, MailIcon } from "lucide-react";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui";

const RegisterEmailSentPage: React.Page = () => {
  return (
    <div className="flex h-[calc(100dvh-190px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <MailIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600">
            We've sent a verification link to your email address. Please click
            the link to verify your account.
          </p>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            // onClick={() => console.log("Resend verification email")}
          >
            Resend verification email
          </Button>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
export default RegisterEmailSentPage;
