"use client";

import { createContext, type ReactNode, useContext } from "react";

import { CustomerProfileResponseBody } from "customer_api";

export type Session = CustomerProfileResponseBody;

type SessionContextType = {
  sessionPromise: Promise<null | Session>;
};

const SessionContext = createContext<null | SessionContextType>(null);

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);

  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export const UserSessionProvider = ({
  children,
  sessionPromise,
}: {
  children: ReactNode;
  sessionPromise: Promise<null | Session>;
}) => (
  <SessionContext.Provider value={{ sessionPromise: sessionPromise }}>
    {children}
  </SessionContext.Provider>
);
