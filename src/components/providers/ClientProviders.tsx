"use client";
import AudioProvider from "./AudioProvider";
import ThemeProvider from "./ThemeProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AudioProvider>{children}</AudioProvider>
    </ThemeProvider>
  );
}
