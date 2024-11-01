import type { LegacyRef, MutableRefObject } from "react";
import { useEffect, useRef } from "react";

type EventType = MouseEvent | TouchEvent;
type EventCallback = (event: EventType) => void;

export default function useClickOutside<T extends HTMLElement>(
  handler: EventCallback
) {
  const domNodeRef = useRef<T | null>(null);

  useEffect(() => {
    if (!handler) return;
    if (!window) return;

    const controller = new AbortController();
    const { signal } = controller;

    const elOptions = {
      passive: true,
      signal,
    };

    const maybeHandler = (event: EventType) => {
      // Check if the click is outside the referenced DOM node
      if (!domNodeRef.current) return;
      if (!domNodeRef.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    window.addEventListener("touchstart", maybeHandler, elOptions);
    window.addEventListener("mousedown", maybeHandler, elOptions);

    return () => {
      controller.abort(); // Abort the listeners using the controller
    };
  }, [handler]);

  return domNodeRef as LegacyRef<T>;
  // return domNodeRef;
}

export { useClickOutside };
