"use client";

import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
  };

export default function SnackbarProviderWrapper({ children } : Props) {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      maxSnack={3}
    >
      {children}
    </SnackbarProvider>
  );
}
