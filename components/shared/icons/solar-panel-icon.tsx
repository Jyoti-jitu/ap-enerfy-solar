import React from "react";

export function SolarPanelIcon({
  className = "h-6 w-6",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Solar Panel Outer Frame */}
      <rect x="2.5" y="3" width="19" height="13" rx="1.5" />
      {/* Horizontal Grid Line */}
      <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" />
      {/* Vertical Grid Lines creating 6 PV cells */}
      <line x1="8.8" y1="3" x2="8.8" y2="16" />
      <line x1="15.2" y1="3" x2="15.2" y2="16" />
      {/* Mounting Stand & Base */}
      <path d="M7 16l-2 5" />
      <path d="M17 16l2 5" />
      <path d="M4.5 21h15" />
    </svg>
  );
}

export function QuoteIcon({
  className = "h-6 w-6",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 6-4 8z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 6-4 8z" />
    </svg>
  );
}
