import Script from "next/script";

import { google } from "@/configs/default";

// type Props = {
//   redirectTo?: string;
// };
export const GoogleRegister: React.FC = () => {
  const loginUrl = new URL(google.registerRedirectUrl!);
  // if (redirectTo) {
  //   loginUrl.searchParams.set("redirectTo", redirectTo);
  // }

  return (
    <div>
      {/* FIXME: rerun after logout */}
      <Script src="https://accounts.google.com/gsi/client" async />
      <div
        id="g_id_onload"
        data-client_id={google.clientId}
        data-context="signin"
        data-ux_mode="redirect"
        data-login_uri={loginUrl.href}
        data-auto_prompt="false"
      />
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="filled_blue"
        data-text="signup_with"
        data-size="large"
        data-logo_alignment="left"
        style={{ colorScheme: "auto", height: "44px" }}
      />
    </div>
  );
};
