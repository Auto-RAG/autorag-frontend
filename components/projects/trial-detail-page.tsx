"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { Editor } from "@monaco-editor/react";
import {
  Settings2,
  PlayCircle,
  FileText,
  BarChart2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import QADashboard from "../qacreations/qacreation-page";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Task {
  id: string;
  project_id: string;
  trial_id: string;
  name: string;
  type: "parse" | "chunk" | "qa" | "validate" | "evaluate";
  status: "not_started" | "in_progress" | "completed" | "failed";
  error_message?: string;
  created_at: string;
  save_path?: string;
}

interface Trial {
  id: string;
  project_id: string;
  name: string;
  status: "not_started" | "in_progress" | "completed" | "failed";
  config_yaml: string;
  created_at: string;
}

export function TrialDetail({
  projectId,
  trialId,
}: {
  projectId: string;
  trialId: string;
}) {
  const [trial, setTrial] = useState<Trial | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [config, setConfig] = useState("");
  const [isConfigEditing, setIsConfigEditing] = useState(false);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // URL 해시가 변경될 때마다 탭 상태 업데이트
  useEffect(() => {
    const hash = window.location.hash.slice(1);

    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  // 탭 변경 시 URL 해시 업데이트
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`${window.location.pathname}#${value}`, { scroll: false });
  };

  // useEffect(() => {
  //   const fetchTrialData = async () => {
  //     try {
  //       const trialResponse = await fetch(
  //         `/api/projects/${projectId}/trials/${trialId}`,
  //       );
  //       const trialData = await trialResponse.json();

  //       setTrial(trialData);
  //       setConfig(trialData.config_yaml);

  //       const tasksResponse = await fetch(
  //         `/api/projects/${projectId}/trials/${trialId}/tasks`,
  //       );
  //       const tasksData = await tasksResponse.json();

  //       setTasks(tasksData);
  //     } catch (error) {
  //       console.error("Error fetching trial data:", error);
  //     }
  //   };

  //   fetchTrialData();
  // }, [projectId, trialId]);

  const handleConfigSave = async () => {
    try {
      await fetch(`/api/projects/${projectId}/trials/${trialId}/config`, {
        method: "POST",
        body: JSON.stringify({ config_yaml: config }),
      });
      setIsConfigEditing(false);
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  const handleRunTrial = async () => {
    try {
      await fetch(`/api/projects/${projectId}/trials/${trialId}/evaluate`, {
        method: "POST",
        body: JSON.stringify({ config_yaml: config }),
      });
    } catch (error) {
      console.error("Error running trial:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="text-green-500" />;
      case "in_progress":
        return <AlertCircle className="text-blue-500" />;
      case "failed":
        return <XCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const renderTasksTable = () => (
    <Table aria-label="Tasks list">
      <TableHeader>
        <TableColumn>TYPE</TableColumn>
        <TableColumn>NAME</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>CREATED AT</TableColumn>
        <TableColumn>OUTPUT</TableColumn>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="capitalize">{task.type}</TableCell>
            <TableCell>{task.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <span
                  className={`
                  ${task.status === "completed" && "text-green-500"}
                  ${task.status === "in_progress" && "text-blue-500"}
                  ${task.status === "failed" && "text-red-500"}
                `}
                >
                  {task.status}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {new Date(task.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {task.save_path && (
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  onClick={() =>
                    window.open(`/api/files${task.save_path}`, "_blank")
                  }
                >
                  View Output
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Button
            color="default"
            startContent={<ChevronLeft size={16} />}
            variant="light"
            onClick={() => window.history.back()}
          >
            Back to Trials
          </Button>
          <h1 className="text-2xl font-bold">
            {trial?.name || "Trial Details"}
          </h1>
          <p className="text-sm text-gray-500">
            Created at:{" "}
            {trial?.created_at
              ? new Date(trial.created_at).toLocaleString()
              : "-"}
          </p>
        </div>
        <div className="space-x-4">
          {!isConfigEditing ? (
            <Button
              color="primary"
              startContent={<Settings2 size={16} />}
              variant="flat"
              onClick={() => setIsConfigEditing(true)}
            >
              Edit Config
            </Button>
          ) : (
            <Button color="success" onClick={handleConfigSave}>
              Save Config
            </Button>
          )}
          <Button
            color="primary"
            disabled={trial?.status === "in_progress"}
            startContent={<PlayCircle size={16} />}
            onClick={handleRunTrial}
          >
            Run Trial
          </Button>
        </div>
      </div>

      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger className="flex items-center gap-2" value="overview">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="config">
            <Settings2 className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="qa">
            <Settings2 className="h-4 w-4" />
            QA Creation
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="tasks">
            <PlayCircle className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="results">
            <BarChart2 className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Trial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(trial?.status || "")}
                      <span className="text-lg capitalize">
                        {trial?.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Total Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg">{tasks.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg">
                      {(
                        (tasks.filter((t) => t.status === "completed").length /
                          tasks.length) *
                          100 || 0
                      ).toFixed(1)}
                      %
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa">
          <Card>
            <CardHeader>
              <CardTitle>QA Data Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[800px] border rounded-md overflow-y-auto">
                <QADashboard />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=" border rounded-md overflow-hidden">
                <Editor
                  defaultLanguage="yaml"
                  height="100%"
                  options={{
                    minimap: { enabled: false },
                    readOnly: !isConfigEditing,
                  }}
                  value={config}
                  onChange={(value) => setConfig(value || "")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>{renderTasksTable()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Results & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add results visualization components */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
