"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { client } from "@/services/client";

type FavoritesContextType = {
  favoriteIds: Set<number>;
  isLoading: boolean;
  isFavorited: (petId: number) => boolean;
  addFavorite: (petId: number) => Promise<boolean>;
  removeFavorite: (petId: number) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);

  if (context === null) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const refreshFavorites = useCallback(async () => {
    try {
      const response = await client.pets.getFavoritePetsList({ query: {} });
      if (response.status === 200) {
        const ids = new Set(response.body.data.map((pet) => pet.id));
        setFavoriteIds(ids);
      }
    } catch {
      // User might not be authenticated, that's fine
      setFavoriteIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorited = useCallback(
    (petId: number) => favoriteIds.has(petId),
    [favoriteIds]
  );

  const addFavorite = useCallback(async (petId: number): Promise<boolean> => {
    try {
      const response = await client.pets.addFavoritePet({
        params: { id: petId },
        body: {},
      });

      if (response.status === 201) {
        setFavoriteIds((prev) => new Set(prev).add(petId));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const removeFavorite = useCallback(async (petId: number): Promise<boolean> => {
    try {
      const response = await client.pets.removeFavoritePet({
        params: { id: petId },
        body: {},
      });

      if (response.status === 204) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(petId);
          return next;
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isLoading,
        isFavorited,
        addFavorite,
        removeFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
