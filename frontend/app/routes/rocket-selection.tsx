import { useNavigate } from "react-router";
import { useEffect } from "react";
import { RocketSelectionModal } from "~/components/features/RocketSelection";

export default function RocketSelectionModalRoute() {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <RocketSelectionModal 
      opened={true}
      onClose={closeModal}
    />
  );
}