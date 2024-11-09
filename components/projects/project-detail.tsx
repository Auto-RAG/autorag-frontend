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
  ChevronLeft,
} from "lucide-react";

import { CreateTrialDialog } from "./trial-creation-wizard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

// 예시 데이터
const mockTrials = [
  {
    id: "1",
    name: "Trial #1",
    status: "completed",
    created_at: "2024-03-01T10:00:00Z",
    config_yaml: "",
  },
  {
    id: "2",
    name: "Trial #2",
    status: "in_progress",
    created_at: "2024-03-02T15:30:00Z",
    config_yaml: "",
  },
  {
    id: "3",
    name: "Trial #3",
    status: "failed",
    created_at: "2024-03-03T09:45:00Z",
    config_yaml: "",
  },
] as Trial[];

export function ProjectDetail({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trials, setTrials] = useState<Trial[]>(mockTrials); // 초기 상태를 목업 데이터로 설정
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch trials
        const trialsResponse = await fetch(`/api/projects/${projectId}/trials`);
        const trialsData = await trialsResponse.json();

        setTrials(trialsData.data); // API 호출 시 데이터로 업데이트

        // Fetch tasks
        const tasksResponse = await fetch(`/api/projects/${projectId}/tasks`);
        const tasksData = await tasksResponse.json();

        setTasks(tasksData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setIsLoading(false);
      }
    };

    // API 호출을 주석 처리하여 목업 데이터 사용
    // fetchProjectData();
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

  const renderTrialsTable = () => (
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
              {new Date(trial.created_at).toLocaleDateString()}
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button
            color="default"
            startContent={<ChevronLeft size={16} />}
            variant="light"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold mt-2">Project Details</h1>
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
            />
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger className="flex items-center gap-2" value="overview">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="trials">
            <Beaker className="h-4 w-4" />
            Trials
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="results">
            <BarChart2 className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="chat">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>{renderOverviewCards()}</CardContent>
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

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>{/* Results content */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat Interface</CardTitle>
            </CardHeader>
            <CardContent>{/* Chat interface content */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
