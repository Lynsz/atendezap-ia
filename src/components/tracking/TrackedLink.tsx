"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { TrackingEventName, TrackingProperties } from "@/lib/tracking";
import { isOptimizedSmallCampaign, trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  eventName: TrackingEventName;
  properties?: TrackingProperties;
};

export function TrackedLink({ href, children, className, eventName, properties }: TrackedLinkProps) {
  function handleClick() {
    trackEvent(eventName, properties);
    if (isOptimizedSmallCampaign()) {
      trackEvent("optimized_campaign_cta_click", {
        ...properties,
        original_event: eventName
      });
    }
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
