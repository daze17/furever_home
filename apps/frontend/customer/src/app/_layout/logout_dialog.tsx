"use client";

import { atom, useAtom, useAtomValue } from "jotai";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  toast,
} from "ui";

import { globalTransitionAtom } from "@/components/global_transition";

export const isOpenAtom = atom(false);

export const setIsOpenAtom = atom(
  (get) => get(isOpenAtom),
  (get, set, isOpen: boolean) => set(isOpenAtom, isOpen),
);

export const LogoutDialog: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useAtom(setIsOpenAtom);

  const { isPending, startTransition } = useAtomValue(globalTransitionAtom);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Гарахдаа итгэлтэй байна уу?
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 pt-10">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Үгүй
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={isPending}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                await fetch("/api/session", {
                  method: "DELETE",
                });
                startTransition(() => {
                  router.push("/");
                  router.refresh();
                });
                toast({
                  title: "You have been logged out.",
                });
                setIsOpen(false);
              } catch (error) {
                console.log(error);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Тийм
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
