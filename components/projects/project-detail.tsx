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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-6">
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

        <h1 className="text-2xl font-bold font-ibm-bold">Project : <b>{projectName || "Project Details"}</b></h1>

        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <Button 
              color="primary" 
              className="w-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              🚀 Quickstart New Trial
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
    </div>
  );
}
