import { useEffect, useRef } from "react";
import { useBlocker } from "react-router";

interface UseNavigationWarningProps {
  enabled: boolean;
  message?: string;
}

/**
 * Hook to handle navigation warnings using browser native dialogs
 */
export const useNavigationWarning = ({
  enabled,
  message = "現在の進捗が保存されていません。このページを離れてもよろしいですか？",
}: UseNavigationWarningProps) => {
  const bypassNextNavigation = useRef(false);

  // Block programmatic navigation (React Router)
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (bypassNextNavigation.current) {
      bypassNextNavigation.current = false;
      return false;
    }
    
    // Only block when leaving the design page, not when coming to it
    if (enabled && currentLocation.pathname === "/design" && nextLocation.pathname !== "/design") {
      // Use native browser confirm dialog
      return !window.confirm(message);
    }
    return false;
  });

  // Handle browser navigation (back button, refresh, close tab)
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, message]);

  const allowNextNavigation = () => {
    bypassNextNavigation.current = true;
  };

  return {
    allowNextNavigation,
  };
};