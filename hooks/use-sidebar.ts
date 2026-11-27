"use client";

import { useState, useEffect, useCallback } from "react";

const SIDEBAR_PREF_KEY = "ap_enerfy_sidebar_collapsed";

export function useSidebar() {
  const [isCollapsed, setIsCollapsedState] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(SIDEBAR_PREF_KEY);
      if (saved !== null) {
        setIsCollapsedState(saved === "true");
      }
    } catch {
      // localStorage may be disabled
    }
  }, []);

  const setIsCollapsed = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setIsCollapsedState((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      try {
        localStorage.setItem(SIDEBAR_PREF_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, [setIsCollapsed]);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return {
    isCollapsed: isMounted ? isCollapsed : false,
    setIsCollapsed,
    toggleCollapsed,
    isMobileOpen,
    setIsMobileOpen,
    toggleMobile,
    isMounted,
  };
}
