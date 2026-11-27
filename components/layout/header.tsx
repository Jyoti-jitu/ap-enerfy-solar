"use client";

import { AppHeader } from "./app-header";

export function Header({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu: () => void;
}) {
  return <AppHeader onOpenMobileMenu={onOpenMobileMenu} />;
}
