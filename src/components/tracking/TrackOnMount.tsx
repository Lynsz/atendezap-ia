"use client";

import { useEffect } from "react";
import type { TrackingEventName, TrackingProperties } from "@/lib/tracking";
import { captureUtmsFromLocation, isOptimizedSmallCampaign, trackEvent } from "@/lib/tracking";

type TrackOnMountProps = {
  eventName: TrackingEventName;
  properties?: TrackingProperties;
  source?: string;
  funnel?: string;
};

export function TrackOnMount({ eventName, properties, source, funnel }: TrackOnMountProps) {
  useEffect(() => {
    captureUtmsFromLocation({ source, funnel });
    trackEvent(eventName, properties);
    if (isOptimizedSmallCampaign()) {
      trackEvent("optimized_campaign_page_view", {
        page_event: eventName,
        source: source || "unknown",
        funnel: funnel || "unknown"
      });
    }
  }, [eventName, funnel, properties, source]);

  return null;
}
