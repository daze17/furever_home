"use client";

import { createContext, type ReactNode, useContext } from "react";

type FavoritesCountContextType = {
  favoritesCountPromise: Promise<number | null>;
};

const FavoritesCountContext = createContext<FavoritesCountContextType | null>(
  null,
);

export const useFavoritesCount = (): FavoritesCountContextType => {
  const context = useContext(FavoritesCountContext);

  if (context === null) {
    throw new Error(
      "useFavoritesCount must be used within a FavoritesCountProvider",
    );
  }

  return context;
};

export const FavoritesCountProvider = ({
  children,
  favoritesCountPromise,
}: {
  children: ReactNode;
  favoritesCountPromise: Promise<number | null>;
}) => (
  <FavoritesCountContext.Provider value={{ favoritesCountPromise }}>
    {children}
  </FavoritesCountContext.Provider>
);
