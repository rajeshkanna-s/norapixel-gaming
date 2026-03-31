"use client";
import AudioProvider from "./AudioProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
