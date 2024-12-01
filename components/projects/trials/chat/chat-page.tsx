"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { CircleStop, Play, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APIClient } from "@/lib/api-client";


const DASHBOARD_URL = "http://localhost:8501";

export function ChatPage({
  project_id,
  trial_id
}: {
  project_id: string;
  trial_id: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const startChatServer = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.openChat(project_id, trial_id);
      
      if (response.status !== 'running') {
        throw new Error('Failed to start chat server');
      }

      toast.success("Chat server started. Press refresh to see the chat.");
    } catch (error) {
      console.error('Error starting chat server:', error);
      toast.error("The chat server already started");
    } finally {
      setIsLoading(false);
    }
  };

  const stopChatServer = async () => {
    try {
      const response = await apiClient.closeChat(project_id, trial_id);
      
      if (response.status !== 'terminated') {
        throw new Error('Failed to stop chat server');
      }
      toast.success("Report stopped");
    } catch (error) {
      console.error('Error stopping chat server:', error);
      toast.error("The chat server already stopped or not started");
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
      <div className="flex justify-end p-6 space-x-2">
        <Button 
          className="p-4 text-green-500 bg-transparent"
          disabled={isLoading}
          onClick={startChatServer}
        >
          <Play className="w-4 h-4" />
          Start
        </Button>
        <Button 
          className="p-4 text-red-500 bg-transparent"
          onClick={stopChatServer}
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
      <iframe
        key={key}
        className="flex-1 w-full border-none"
        src={DASHBOARD_URL}
        title="Trial Dashboard"
        />
    </div>
  );
}
