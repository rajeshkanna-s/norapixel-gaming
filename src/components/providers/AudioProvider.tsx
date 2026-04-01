"use client";
import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

/* ── Route → Track mapping ─────────────────────────────────
   Each page gets its own vibe. Pages without an explicit
   mapping fall back to the default epic track.              */
const ROUTE_TRACKS: Record<string, { src: string; label: string }> = {
  "/":             { src: "",            label: "Logo Soundtrack" },
  "/about":        { src: "/goldensoundlabs-emotional-160374.mp3", label: "Emotional — Golden Sound Labs" },
  "/youtube":      { src: "/nastelbom-epic-501714.mp3",            label: "Epic — Nastelbom" },
  "/games":        { src: "/nastelbom-epic-war-383905.mp3",        label: "Epic War — Nastelbom" },
  "/achievements": { src: "/paulyudin-war-493487.mp3",            label: "War — Paulyudin" },
  "/setup":        { src: "/nastelbom-epic-501714.mp3",            label: "Epic — Nastelbom" },
  "/rent":         { src: "/goldensoundlabs-emotional-160374.mp3", label: "Emotional — Golden Sound Labs" },
  "/contact":      { src: "/nastelbom-epic-501714.mp3",            label: "Epic — Nastelbom" },
  "/blog":         { src: "/goldensoundlabs-emotional-160374.mp3", label: "Emotional — Golden Sound Labs" },
};

const DEFAULT_TRACK = { src: "/paulyudin-war-493487.mp3", label: "War — Paulyudin" };

function getTrackForRoute(pathname: string) {
  // Exact match first
  if (ROUTE_TRACKS[pathname]) return ROUTE_TRACKS[pathname];
  // Prefix match (e.g. /blog/some-slug → /blog, /games/chess → /games)
  const base = "/" + pathname.split("/")[1];
  return ROUTE_TRACKS[base] || DEFAULT_TRACK;
}

/* ── Context ── */
interface AudioContextType {
  muted: boolean;
  toggleMute: () => void;
  trackName: string;
}

const AudioCtx = createContext<AudioContextType>({
  muted: true,
  toggleMute: () => {},
  trackName: "",
});

export function useAudio() {
  return useContext(AudioCtx);
}

/* ── Provider ── */
export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [trackName, setTrackName] = useState("");
  const currentSrcRef = useRef("");
  const hasStartedRef = useRef(false);

  // When the route changes, swap the track (only if music is playing)
  useEffect(() => {
    const { src, label } = getTrackForRoute(pathname);
    setTrackName(label);

    const audio = audioRef.current;
    if (!audio) return;

    // Only swap audio source if it actually changed
    if (currentSrcRef.current !== src) {
      currentSrcRef.current = src;
      const wasPlaying = !audio.paused;
      
      if (src) {
        audio.src = src;
        audio.load();
        if (wasPlaying) {
          audio.play().catch(() => {});
        }
      } else {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    }
  }, [pathname]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      // First time → load the track for the current route
      if (!hasStartedRef.current) {
        const { src } = getTrackForRoute(pathname);
        currentSrcRef.current = src;
        if (src) {
          audio.src = src;
          audio.load();
        }
        hasStartedRef.current = true;
      }
      if (currentSrcRef.current) {
        audio.play().catch(() => {});
      }
      setMuted(false);
    } else {
      audio.pause();
      setMuted(true);
    }
  }, [muted, pathname]);

  return (
    <AudioCtx.Provider value={{ muted, toggleMute, trackName }}>
      <audio
        ref={audioRef}
        preload="none"
        loop
        style={{ display: "none" }}
      />
      {children}
    </AudioCtx.Provider>
  );
}
