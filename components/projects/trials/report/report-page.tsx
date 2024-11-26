"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";



export function ReportPage({
  project_id,
  trial_id
}: {
  project_id: string;
  trial_id: string;
}) {
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${project_id}/trials/${trial_id}/dashboard/start`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to start dashboard');
      }

      const data = await response.json();

      setDashboardUrl(data.url);
    } catch (error) {
      console.error('Error starting dashboard:', error);
      toast.error("Failed to start dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const stopDashboard = async () => {
    try {
      await fetch(`/api/projects/${project_id}/trials/${trial_id}/dashboard/stop`, {
        method: 'POST'
      });
      setDashboardUrl(null);
    } catch (error) {
      console.error('Error stopping dashboard:', error);
      toast.error("Failed to stop dashboard");
    }
  };

  useEffect(() => {
    startDashboard();

    return () => {
      stopDashboard();
    };
  }, [project_id, trial_id]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-end p-4">
        <Button 
          disabled={!dashboardUrl}
          variant="destructive"
          onClick={stopDashboard}
        >
          Stop Dashboard
        </Button>
      </div>
      {dashboardUrl && (
        <iframe
          className="flex-1 w-full border-none"
          src={dashboardUrl}
          title="Trial Dashboard"
        />
      )}
    </div>
  );
}
