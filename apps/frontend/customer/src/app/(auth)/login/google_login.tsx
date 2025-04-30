"use client";

import { useEffect } from "react";
import { cn } from "utils";

import { google } from "@/configs/default";

// import Script from "next/script";

// import { commonEnv } from "@/configs/env/env.common";

type Props = {
  isPending?: boolean;
  redirectTo?: string;
};
export const GoogleLogin: React.FC<Props> = ({ isPending, redirectTo }) => {
  const loginUrl = new URL(google.loginRedirectUrl!);
  if (redirectTo) {
    loginUrl.searchParams.set("redirectTo", redirectTo);
  }

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      aria-disabled={isPending}
      className={cn("h-[44px]", isPending && "pointer-events-none opacity-50")}
    >
      {/* FIXME: rerun after logout */}
      {/* <Script src="https://accounts.google.com/gsi/client" async /> */}

      <div
        className="g_id_signin h-[44px]"
        data-type="standard"
        data-shape="pill"
        data-theme="filled_blue"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
        style={{ colorScheme: "auto" }}
      />
      <div
        id="g_id_onload"
        data-client_id={google.clientId}
        data-context="signin"
        data-ux_mode="redirect"
        data-login_uri={loginUrl.href}
        data-auto_prompt="false"
      />
    </div>
  );
};
