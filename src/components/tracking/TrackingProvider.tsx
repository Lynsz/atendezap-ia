"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUtmsFromLocation, trackPageView } from "@/lib/tracking";

export function TrackingProvider() {
  const pathname = usePathname();

  useEffect(() => {
    captureUtmsFromLocation({
      source: pathname?.startsWith("/ebook") ? "ebook_page" : undefined,
      funnel: pathname?.startsWith("/ebook") ? "ebook" : undefined
    });
    trackPageView();
  }, [pathname]);

  return null;
}
