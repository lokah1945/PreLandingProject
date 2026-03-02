"use client";

import React, { useEffect, useMemo, useRef } from "react";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function scheduleNonBlocking(cb: () => void): (() => void) | undefined {
  if (typeof window === "undefined") return;

  const w = window as unknown as {
    requestIdleCallback?: (
      fn: () => void,
      opts?: { timeout?: number }
    ) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (typeof w.requestIdleCallback === "function") {
    const id = w.requestIdleCallback(cb, { timeout: 1200 });
    return () => {
      if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(id);
    };
  }

  const id = window.setTimeout(cb, 0);
  return () => window.clearTimeout(id);
}

export default function BannerSlot({ code }: { code: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const normalized = useMemo(
    () => (isNonEmptyString(code) ? code.trim() : ""),
    [code]
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    host.innerHTML = "";
    if (!normalized) return;

    const cancel = scheduleNonBlocking(() => {
      if (!hostRef.current) return;
      hostRef.current.innerHTML = "";

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(normalized, "text/html");
        const frag = document.createDocumentFragment();

        const nodes = Array.from(doc.body.childNodes);
        for (const node of nodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (el.tagName.toLowerCase() === "script") continue;
          }
          frag.appendChild(document.importNode(node, true));
        }

        hostRef.current.appendChild(frag);

        const scripts = Array.from(doc.querySelectorAll("script"));
        for (const s of scripts) {
          const script = document.createElement("script");
          const src = s.getAttribute("src");

          if (src) {
            script.src = src;
            script.async = true;
            script.defer = true;
          } else {
            script.text = s.textContent ?? "";
          }

          const type = s.getAttribute("type");
          if (type) script.type = type;

          for (const attr of Array.from(s.attributes)) {
            if (attr.name.startsWith("data-"))
              script.setAttribute(attr.name, attr.value);
          }

          hostRef.current.appendChild(script);
        }
      } catch {
        if (hostRef.current) hostRef.current.innerHTML = "";
      }
    });

    return () => {
      if (typeof cancel === "function") cancel();
    };
  }, [normalized]);

  return (
    <div
      className="adSlot__host"
      ref={hostRef}
      suppressHydrationWarning
    />
  );
}

