"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { CircleStop, Play, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APIClient } from "@/lib/api-client";


const DASHBOARD_URL = "http://localhost:7690";

export function ReportPage({
  project_id,
  trial_id
}: {
  project_id: string;
  trial_id: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const startDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.openReport(project_id, trial_id);
      
      if (response.status !== 'running') {
        throw new Error('Failed to start dashboard');
      }

      toast.success("Report started. Press refresh to see the report.");
    } catch (error) {
      console.error('Error starting dashboard:', error);
      toast.error("The report already started");
    } finally {
      setIsLoading(false);
    }
  };

  const stopDashboard = async () => {
    try {
      const response = await apiClient.closeReport(project_id, trial_id);
      
      if (response.status !== 'terminated') {
        throw new Error('Failed to stop dashboard');
      }
      toast.success("Report stopped");
    } catch (error) {
      console.error('Error stopping dashboard:', error);
      toast.error("The report already stopped or not started");
    }
  };

    const refreshIframe = () => {
        setKey(prevKey => prevKey + 1); // Increment key to force re-render
    };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-between items-center p-6">
        <div className="text-sm text-muted-foreground">
          Please press the stop button when you move to another page to ensure the report is properly terminated.
        </div>
        <div className="flex space-x-2">
          <Button 
            className="p-4 text-green-500 bg-transparent"
          disabled={isLoading}
          onClick={startDashboard}
        >
          <Play className="w-4 h-4" />
            Start
          </Button>
          <Button 
            className="p-4 text-red-500 bg-transparent"
          onClick={stopDashboard}
        >
          <CircleStop className="w-4 h-4" />
          Stop
          </Button>
          <Button 
            className="p-4 text-blue-500 bg-transparent"
            onClick={refreshIframe}
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>
      <iframe
        key={key}
        className="flex-1 w-full border-none"
        src={DASHBOARD_URL}
        title="Trial Dashboard"
        />
    </div>
  );
}
