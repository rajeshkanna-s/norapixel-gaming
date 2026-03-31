"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import GameLoader from "@/components/ui/GameLoader";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState("");

  const handleClick = useCallback((e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto")) return;
    // Internal link clicked — show loader immediately
    if (href !== pathname) {
      setTarget(href);
      setLoading(true);
    }
  }, [pathname]);

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleClick]);

  // Hide loader when pathname changes (route loaded)
  useEffect(() => {
    setLoading(false);
    setTarget("");
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-bg-primary/95 backdrop-blur-sm flex items-center justify-center">
      <GameLoader text="LOADING" />
    </div>
  );
}
