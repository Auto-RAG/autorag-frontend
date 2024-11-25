"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Beaker, BarChart2, FileText } from "lucide-react";
import { format } from 'timeago.js';
import { ChevronRight } from "lucide-react";

import ArtifactsView from "../artifacts/artifacts-view-library";

import { CreateTrialDialog } from "./trial-creation-wizard";
import { UploadFiles } from "./upload-files";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APIClient, Trial } from "@/lib/api-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Task {
  id: string;
  project_id: string;
  trial_id: string;
  name: string;
  type: "parse" | "chunk" | "qa" | "validate" | "evaluate";
  status: "not_started" | "in_progress" | "completed" | "failed";
  created_at: string;
  save_path?: string;
}

export function ProjectDetail({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upload");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectName, setProjectName] = useState("");

  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  useEffect(() => {
    // Fetch project name and trials
    const fetchData = async () => {
      try {
        const trialsResponse = await apiClient.getTrials(projectId);

        setProjectName(projectId);
        var trials = trialsResponse.data;

        console.log(trials[0].created_at);
        console.log(trials[0].created_at.replace(/, /, ' '));
        console.log(new Date(trials[0].created_at.replace(/, /, ' ')));

        // Sort trials by creation date in descending order
        trials = trials.sort((a, b) => {
          const dateA = new Date(a.created_at.replace(/, /, ' '));
          const dateB = new Date(b.created_at.replace(/, /, ' '));
          
          return dateB.getTime() - dateA.getTime(); // Sort descending - newest first
        });
        // @ts-ignore
        setTrials(trials as Trial[]); // Type assertion to match the state type
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return (
    <div className="w-full space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage><b>{projectName || "Project Details"}</b></BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mt-2 font-ibm-bold">Project : <b>{projectName || "Project Details"}</b></h1>
          </div>
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
              <Button color="primary" startContent={<Beaker size={16} />}>
                New Trial
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />

              <CreateTrialDialog
                isOpen={isDialogOpen}
                projectId={projectId}
                onOpenChange={setIsDialogOpen}
                onTrialCreated={() => {
                  setIsDialogOpen(false);
                  router.refresh();
                }}
              />
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="flex items-center gap-2" value="upload">
              <FileText className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="artifacts">
              <BarChart2 className="h-4 w-4" />
              Documents
            </TabsTrigger>
            {/* <TabsTrigger className="flex items-center gap-2" value="parse">
              <BarChart2 className="h-4 w-4" />
              Parsed Data
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
              </CardHeader>
              <CardContent>{<UploadFiles filesUploadedCallback={() => {
                setActiveTab("artifacts");
              }} projectId={projectId} />}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="artifacts">
            <Card>
              <CardHeader>
                <CardTitle>Artifacts(RAW_DATA)</CardTitle>
              </CardHeader>
              <CardContent><ArtifactsView projectId={projectId} /></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
