import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import RouteLoader from "@/components/ui/RouteLoader";
import ClientProviders from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "NoraPixel | Gaming Content Creator",
  description:
    "Official website of NoraPixel — gaming content creator, streamer, and esports enthusiast. Watch videos, play browser games, and join the community.",
  keywords: ["gaming", "content creator", "YouTube", "esports", "browser games", "NoraPixel"],
  icons: {
    icon: "/favicon.svg",
    apple: "/newlogo.jpg",
  },
  openGraph: {
    title: "NoraPixel | Level Up Your Game",
    description:
      "Official website of NoraPixel — gaming content creator, streamer, and esports enthusiast.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-bg-primary text-text-primary font-body antialiased" suppressHydrationWarning>
        <ClientProviders>
          <ParticleCanvas />
          <RouteLoader />
          <div className="grid-bg fixed inset-0 z-0 pointer-events-none opacity-40" />
          <Navbar />
          <main className="relative z-10 pt-16">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
