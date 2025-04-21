"use client";

import { ReactNode } from "react";
import { ModalProvider } from "@/contexts/ModalContext";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { SettingsProvider } from "@/contexts/SettingsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ModalProvider>
        <DatabaseProvider>
          {children}
        </DatabaseProvider>
      </ModalProvider>
    </SettingsProvider>
  );
}
