import { Top } from "~/components/Top";
import type { Route } from "./+types/_index";
import { useLocation, useNavigate } from "react-router";
import { useEffect, lazy, Suspense } from "react";

const SettingsModal = lazy(() => import("./settings"));

export const meta: Route.MetaFunction = () => [
  { title: "Model Rocket Simulator" },
  { name: "description", content: "model rocket simulator" },
];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we should show a modal based on current path
  const isModalRoute = location.pathname === "/settings";
  
  // If user navigated directly to /settings, redirect to home with modal state
  useEffect(() => {
    if (isModalRoute && !location.state?.backgroundLocation) {
      navigate("/", { 
        state: { showModal: "settings" },
        replace: true 
      });
    }
  }, [isModalRoute, location.state, navigate]);
  
  const showSettingsModal = location.state?.showModal === "settings" || 
                           (isModalRoute && location.state?.backgroundLocation);
  
  return (
    <>
      <Top />
      {showSettingsModal && (
        <Suspense fallback={null}>
          <SettingsModal />
        </Suspense>
      )}
    </>
  );
}
