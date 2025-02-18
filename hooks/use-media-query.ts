"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Initialize with null and update immediately in useEffect to avoid hydration mismatch
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener("change", listener);

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]); // Only re-run effect if query changes

  return matches;
}
