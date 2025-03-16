import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import MetricsModal from "./metrics-modal";

export default function MetricsCheck() {
  const [metricsModalOpen, setMetricsModalOpen] = useState(false);
  const { user } = useAuth();

  // Check if user has metrics and show modal if not
  useEffect(() => {
    if (user && (!user.height || !user.weight || !user.age || !user.gender)) {
      setMetricsModalOpen(true);
    }
  }, [user]);

  return (
    <MetricsModal 
      open={metricsModalOpen} 
      onOpenChange={setMetricsModalOpen} 
    />
  );
} 