import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { EmailSentForm } from "./email_sent_form";

const COOLDOWN_SECONDS = 60;

const RegisterEmailSentPage: React.Page = async () => {
  const email = (await cookies()).get("registration_email")?.value;

  if (!email) {
    redirect("/register");
  }

  // Calculate initial countdown server-side
  const lastResendTimestamp = (await cookies()).get("last_resend_timestamp")?.value;
  let initialCountdown = 0;

  if (lastResendTimestamp) {
    const timeSinceLastResend = Math.floor(
      (Date.now() - parseInt(lastResendTimestamp)) / 1000,
    );
    const remainingCooldown = COOLDOWN_SECONDS - timeSinceLastResend;
    if (remainingCooldown > 0) {
      initialCountdown = remainingCooldown;
    }
  }

  return (
    <div className="flex h-[calc(100dvh-190px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <EmailSentForm email={email} initialCountdown={initialCountdown} />
    </div>
  );
};

export default RegisterEmailSentPage;
