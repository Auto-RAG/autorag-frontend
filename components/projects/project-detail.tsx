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
import {
  Beaker,
  PlayCircle,
  FileText,
  MessageSquare,
  BarChart2,
  ChevronLeft,Settings,XCircle,
  Upload
} from "lucide-react";
import { format } from 'timeago.js';

import { CreateTrialDialog } from "./trial-creation-wizard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APIClient } from "@/lib/api-client";
import ParseTabContent from "../parsings/parse-results-tab";
import ArtifactsView from "../artifacts/artifacts-view-library";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react";
import { renderUploadFiles } from "./upload-files";

interface Trial {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "completed" | "failed";
  created_at: string;
  config_yaml: string;
}

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
  const [activeTab, setActiveTab] = useState("trials");
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
        const [projectResponse, trialsResponse] = await Promise.all([
          apiClient.getProject(projectId),
          apiClient.getTrials(projectId)
        ]);

        setProjectName(projectResponse.name);
        var trials = trialsResponse.data;

        trials = trials.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in_progress":
        return "text-blue-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  function formatLocalTime(utcTimeStr: string) {
    const date = new Date(utcTimeStr);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    });
  }

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trials</CardTitle>
          <Beaker className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trials.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          <PlayCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {tasks.filter((task) => task.status === "in_progress").length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(
              (tasks.filter((task) => task.status === "completed").length /
                tasks.length) *
                100 || 0
            ).toFixed(1)}
            %
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTrialsTable = () => {
    if (trials.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Beaker className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No trials yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first trial to start experimenting
          </p>
        </div>
      );
    }

    return (
      <Table aria-label="Trials list">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {trials.map((trial) => (
            <TableRow key={trial.id}>
              <TableCell>{trial.name}</TableCell>
              <TableCell>
                <span className={getStatusColor(trial.status)}>
                  {trial.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                  {format(trial.created_at, navigator.language)}
                  </span>
                  <span className="text-xs text-gray-500">
                  {formatLocalTime(trial.created_at)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  onClick={() =>
                    router.push(`/projects/${projectId}/trials/${trial.id}`)
                  }
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

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
        <div>{renderOverviewCards()}</div>
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger className="flex items-center gap-2" value="upload">
              <Beaker className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="trials">
              <Beaker className="h-4 w-4" />
              Trials
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="artifacts">
              <BarChart2 className="h-4 w-4" />
              Artifacts
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="parse">
              <BarChart2 className="h-4 w-4" />
              Parsed Data
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="config">
              <Settings className="h-4 w-4" />
              Configuration

            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Artifacts</CardTitle>
              </CardHeader>
              <CardContent>{renderUploadFiles(projectId, () => {
                setActiveTab("artifacts");
              })}</CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trials">
            <Card>
              <CardHeader>
                <CardTitle>Trials</CardTitle>
              </CardHeader>
              <CardContent>{renderTrialsTable()}</CardContent>
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
          <TabsContent value="parse">
            <Card>
              <CardHeader>
                <CardTitle>Parse Results</CardTitle>
              </CardHeader>
              <CardContent>  <ParseTabContent />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent>{/* Chat interface content */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
