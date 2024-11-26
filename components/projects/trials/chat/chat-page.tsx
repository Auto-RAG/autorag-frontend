"use client"

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { APIClient } from '@/lib/api-client';

interface ChatPageProps {
  project_id: string;
  trial_id: string;
}

export function ChatPage({ project_id, trial_id }: ChatPageProps) {
  const [isRunning, setIsRunning] = useState(false);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const startChat = async () => {
    try {
    //   await apiClient.startChat(projectId, trialId);
      setIsRunning(true);
      toast.success('Chat started successfully');
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const stopChat = async () => {
    try {
    //   await apiClient.stopChat(projectId, trialId);
      setIsRunning(false);
      toast.success('Chat stopped successfully');
    } catch (error) {
      console.error('Failed to stop chat:', error);
      toast.error('Failed to stop chat');
    }
  };

  useEffect(() => {
    // Start chat when component mounts
    startChat();

    // Stop chat when component unmounts or user navigates away
    return () => {
      stopChat();
    };
  }, []);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-end">
        <Button 
          disabled={!isRunning} 
          variant="destructive"
          onClick={stopChat}
        >
          Stop Chat
        </Button>
      </div>
      
      <div className="flex-1 border rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full"
          src={`${process.env.NEXT_PUBLIC_API_URL}/chat/${project_id}/${trial_id}`}
          title="Chat Interface"
        />
      </div>
    </div>
  );
}
