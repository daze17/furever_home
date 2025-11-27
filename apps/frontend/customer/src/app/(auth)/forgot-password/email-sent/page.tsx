import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { EmailSentDisplay } from "./email_sent_display";

const EmailSentPage: React.Page = async () => {
  const email = (await cookies()).get("reset-email")?.value;

  if (!email) {
    redirect("/forgot-password");
  }

  return (
    <main className="flex h-[calc(100dvh-190px)] w-full items-center justify-center">
      <EmailSentDisplay email={email} />
    </main>
  );
};

export default EmailSentPage;
