"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface INextThemesProviderProps {
  children: ReactNode;
}

export default function NextThemesProvider({
  children,
}: INextThemesProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

