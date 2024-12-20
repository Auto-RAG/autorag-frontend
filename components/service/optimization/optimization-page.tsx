"use client";

import { ArrowLeft, LayoutDashboard, MessageSquare, Webhook, File } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportPage } from "@/components/projects/trials/report/report-page";
import { ChatPage } from "@/components/projects/trials/chat/chat-page";
import { ApiServerButtonGroup } from "@/components/projects/trials/api/api-start-stop";
import ApiDocumentation from "@/components/projects/trials/api/api-documentation";
import DocumentParserInterface from "@/components/parsings/document-parser-ui";
import { APIClient, Trial } from "@/lib/api-client";

interface OptimizationPageProps {
  projectId: string;
  trialId: string;
}


export default function OptimizationPage({ projectId, trialId }: OptimizationPageProps) {
    const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');
    const [trialName, setTrialName] = useState("");
    const [activeTab, setActiveTab] = useState("api");
    let hostUrl = process.env.NEXT_PUBLIC_HOST_URL;

    useEffect(() => {
      const getTrialName = async (project_id: string, trial_id: string) => {
      const response: Trial = await apiClient.getTrial(project_id, trial_id);

      setTrialName(response.name);
      }

      getTrialName(projectId, trialId);
    }, [projectId, trialId]);

    if (!hostUrl) {
        hostUrl = "http://localhost";
    }

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
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger className="flex items-center gap-2" value="parsed">
              <File className="h-4 w-4" />
              Parsed Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent className="h-full" value="api">
            <div className="flex flex-col items-center bg-blue-100 p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-2">API Server Controls</h2>
              <ApiServerButtonGroup project_id={projectId} trial_id={trialId} />
              <p className="text-sm text-gray-600 mt-2">Use the buttons above to start or stop the API server.</p>
            </div>
            <div className="mt-4">
              <ApiDocumentation host={`${hostUrl}:8100`}/>
            </div>
          </TabsContent>
          
          <TabsContent className="h-full" value="report">
            <ReportPage dashboard_url={`${hostUrl}:7690`} project_id={projectId} trial_id={trialId}/>
          </TabsContent>
          
          <TabsContent className="h-full" value="chat">
            <ChatPage chat_url={`${hostUrl}:8501`} project_id={projectId} trial_id={trialId} />
          </TabsContent>

          <TabsContent className="h-full" value="parsed">
            <DocumentParserInterface parsed_name={trialName} project_id={projectId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
