"use client";

import { useEffect } from "react";
import type { TrackingEventName, TrackingProperties } from "@/lib/tracking";
import { captureUtmsFromLocation, trackEvent } from "@/lib/tracking";

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
  }, [eventName, funnel, properties, source]);

  return null;
}
