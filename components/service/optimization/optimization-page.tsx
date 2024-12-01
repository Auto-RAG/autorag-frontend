"use client";

import { ArrowLeft, LayoutDashboard, MessageSquare, Webhook } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportPage } from "@/components/projects/trials/report/report-page";
import { ChatPage } from "@/components/projects/trials/chat/chat-page";
import { ApiServerButtonGroup } from "@/components/projects/trials/api/api-start-stop";

interface OptimizationPageProps {
  projectId: string;
  trialId: string;
}

export default function OptimizationPage({ projectId, trialId }: OptimizationPageProps) {
    const [activeTab, setActiveTab] = useState("api");

  return (
    <div className="container mx-auto py-1">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Link 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            href={`/service/${projectId}/optimization`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Optimization Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold">Optimization Details</h1>

        <Tabs className="w-full" defaultValue="api" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="flex items-center gap-2" value="api">
              <Webhook className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="report">
              <LayoutDashboard className="h-4 w-4" />
              Report
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="chat">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent className="h-full" value="api">
            <div className="flex justify-between items-start">
              <div>
                {/* Documentation component for API server usage will be added here */}
              </div>
              <ApiServerButtonGroup project_id={projectId} trial_id={trialId} />
            </div>
          </TabsContent>
          
          <TabsContent className="h-full" value="report">
            <ReportPage project_id={projectId} trial_id={trialId} />
          </TabsContent>
          
          <TabsContent className="h-full" value="chat">
            <ChatPage project_id={projectId} trial_id={trialId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
