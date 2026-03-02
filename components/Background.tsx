"use client";

import React from "react";
import type { ThemeVariant } from "./types";

export default function Background({
  theme,
  imageUrl,
}: {
  theme: ThemeVariant;
  imageUrl: string | null;
}) {
  return (
    <div className={`bg bg--${theme}`} aria-hidden="true">
      {imageUrl ? (
        <div
          className="bg__image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : null}
      <div className="bg__overlay" />
      <div className="bg__grid" />
      <div className="bg__glow bg__glow--1" />
      <div className="bg__glow bg__glow--2" />
      <div className="bg__glow bg__glow--3" />
      <div className="bg__noise" />
    </div>
  );
}

