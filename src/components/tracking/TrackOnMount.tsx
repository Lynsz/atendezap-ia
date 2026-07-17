"use client";

import { useEffect } from "react";
import type { TrackingEventName, TrackingProperties } from "@/lib/tracking";
import { captureUtmsFromLocation, isOptimizedSmallCampaign, isPost12Campaign, trackEvent, trackPost11CampaignEvent } from "@/lib/tracking";

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
    if (eventName === "landing_view") {
      trackPost11CampaignEvent("campaign_landing_viewed", {
        ...properties,
        page: "/",
        source: source || "landing_page"
      });
    }
    if (eventName === "small_launch_pricing_viewed") {
      trackPost11CampaignEvent("campaign_pricing_viewed", {
        ...properties,
        page: "/precos",
        source: source || "pricing_page"
      });
    }
    if (isOptimizedSmallCampaign()) {
      trackEvent("optimized_campaign_page_view", {
        page_event: eventName,
        source: source || "unknown",
        funnel: funnel || "unknown"
      });
    }
    if (isPost12Campaign()) {
      trackEvent("post_12_campaign_page_view", {
        page_event: eventName,
        source: source || "unknown",
        funnel: funnel || "unknown"
      });
    }
  }, [eventName, funnel, properties, source]);

  return null;
}
