import React from 'react';

/* Small round flags as inline SVG (no image assets needed). */

export const FlagUS = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" focusable="false">
    <rect width="64" height="64" fill="#fff" />
    {[0, 2, 4, 6, 8, 10, 12].map((i) => (
      <rect key={i} y={(i * 64) / 13} width="64" height={64 / 13} fill="#d22f3c" />
    ))}
    <rect width="32" height={(64 * 7) / 13} fill="#3c3b6e" />
    {[0, 1, 2, 3].flatMap((r) =>
      [0, 1, 2].map((c) => (
        <circle key={`${r}${c}`} cx={6 + c * 10 + (r % 2) * 0} cy={6 + r * 8} r="1.6" fill="#fff" />
      ))
    )}
  </svg>
);

export const FlagEU = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" focusable="false">
    <rect width="64" height="64" fill="#003399" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <circle key={i} cx={32 + Math.sin(a) * 18} cy={32 - Math.cos(a) * 18} r="2.8" fill="#ffcc00" />;
    })}
  </svg>
);

export const FlagIN = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" focusable="false">
    <rect width="64" height="21.4" fill="#ff9933" />
    <rect y="21.3" width="64" height="21.4" fill="#fff" />
    <rect y="42.6" width="64" height="21.4" fill="#138808" />
    <circle cx="32" cy="32" r="7" fill="none" stroke="#000080" strokeWidth="1.6" />
    <circle cx="32" cy="32" r="1.6" fill="#000080" />
  </svg>
);