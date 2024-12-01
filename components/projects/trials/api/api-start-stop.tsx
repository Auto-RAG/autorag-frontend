"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { CircleStop, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APIClient } from "@/lib/api-client";

interface ApiServerButtonGroupProps {
  project_id: string;
  trial_id: string;
}

export function ApiServerButtonGroup({ project_id, trial_id }: ApiServerButtonGroupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const startApiServer = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.openApiServer(project_id, trial_id);
      
      if (response.status !== 'running') {
        throw new Error('Failed to start API server');
      }

      toast.success("API server started.");
    } catch (error) {
      console.error('Error starting API server:', error);
      toast.error("The API server already started");
    } finally {
      setIsLoading(false);
    }
  };

  const stopApiServer = async () => {
    try {
      const response = await apiClient.closeApiServer(project_id, trial_id);
      
      if (response.status !== 'terminated') {
        throw new Error('Failed to stop API server');
      }
      toast.success("API server stopped");
    } catch (error) {
      console.error('Error stopping API server:', error);
      toast.error("The API server already stopped or not started");
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        className="p-4 text-green-500 bg-transparent"
        disabled={isLoading}
        onClick={startApiServer}
      >
        <Play className="w-4 h-4" />
        Start
      </Button>
      <Button 
        className="p-4 text-red-500 bg-transparent"
        onClick={stopApiServer}
      >
        <CircleStop className="w-4 h-4" />
        Stop
      </Button>
    </div>
  );
}
