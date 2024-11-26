"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import {
  Settings2,
  PlayCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { ChevronRight } from "lucide-react";

import QADashboard from "../qacreations/qacreation-page";
import ParquetViewer from "../qacreations/qa-analysis-layout";

import { ConfigEditor } from "./trials/configuration/config-editor";
import { ConfigSelector } from "./trials/configuration/config-selector";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APIClient, TrialConfig } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Task {
  task_id: string;
  trial_id: string;
  save_dir?: string;
  corpus_path?: string;
  qa_path?: string;
  config_path?: string;
  type: "parse" | "chunk" | "qa" | "validate" | "evaluate";
  status: "not_started" | "in_progress" | "completed" | "failed";
  error_message?: string;
  created_at: string;
  name?: string;
}

interface Trial {
  id: string;
  project_id: string;
  trial_id: string;
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
  const [trialConfig, setTrialConfig] = useState<Trial | null>(null);
  const [trial, setTrial] = useState<Trial | null>(null);
  const mockTasks: Task[] = [
    {
      task_id: "task_001",
      trial_id: trialId,
      type: "parse",
      status: "completed",
      created_at: new Date().toISOString(),
      name: "Parse Task"
    },
    {
      task_id: "task_002", 
      trial_id: trialId,
      type: "chunk",
      status: "in_progress",
      created_at: new Date().toISOString(),
      name: "Chunk Task"
    },
    {
      task_id: "task_003",
      trial_id: trialId,
      type: "qa",
      status: "not_started", 
      created_at: new Date().toISOString(),
      name: "QA Task"
    },
    {
      task_id: "task_004",
      trial_id: trialId,
      type: "validate",
      status: "failed",
      error_message: "Validation failed",
      created_at: new Date().toISOString(),
      name: "Validate Task"
    }
  ];
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [config, setConfig] = useState("");
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tasks");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectName, setProjectName] = useState("");

  // URL 해시가 변경될 때마다 탭 상태 업데이트
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    
    // Fetch project and trial info
    const fetchInitialData = async () => {
      try {
        const [projectResponse, trialConfigResponse, trialResponse] = await Promise.all([
          apiClient.getProject(projectId),
          apiClient.getTrialConfig(projectId, trialId),
          apiClient.getTrial(projectId, trialId)
        ]);
        
        setProjectName(projectResponse.name);
        console.log(trialConfigResponse);
        // @ts-ignore
        setTrialConfig(trialConfigResponse);
        // @ts-ignore
        setTrial(trialResponse);
        // @ts-ignore
        setConfig(trialResponse.config_yaml);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load trial information");
      }
    };

    fetchInitialData();
    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  // 탭 변경 시 URL 해시 업데이트
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`${window.location.pathname}#${value}`, { scroll: false });
    
    // Refresh tasks when switching to tasks tab
    if (value === "tasks") {
      fetchTasks();
    }
  };

  // Move fetchTasks to a separate function outside useEffect
  const fetchTasks = async () => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      const response = await apiClient.getTasks(projectId);
      
      // @ts-ignore
      setTasks(response.data as Task[]);
      toast.success("Tasks fetched successfully");
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error("Error: Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  // Keep the original useEffect for initial load
  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleConfigSave = async () => {
    const response = await fetch("/api/yaml/convert", {
      method: "POST",
      body: JSON.stringify({ content: config }),
    });

    const parsedConfig = await response.json();
    const trialConfig = {
      config: parsedConfig.data
    }

    try {
      const response = await apiClient.setTrialConfig(projectId, trialId, trialConfig);
      
      if (!response) {
        throw new Error("Failed to save config");
      }

      toast.success("Config saved successfully");
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Failed to save configuration");
    }
  };

  const handleRunTrial = async (fullIngest = false, skipValidation = false) => {
    try {
      toast("Starting Trial");

      const task = await apiClient.evaluateTrial(projectId, trialId, {
        full_ingest: fullIngest,
        skip_validation: skipValidation
      });

      console.log(task);
      toast.success("Trial Started");
      fetchTasks();

    } catch (error) {
      console.error("Error running trial:", error);
      toast.error("Failed to start trial evaluation", {
      });
    }
  };

  const handleValidate = async () => {
    try {
      toast("Starting Validation");
      const task = await apiClient.validateTrial(projectId, trialId);

      console.log(task);
      toast.success("Validation Started");
      fetchTasks();
    } catch (error) {
      console.error("Error starting validation:", error);
      toast.error("Failed to start validation");
    }
  };

  const handleConfigSelect = async (configYaml: string) => {
    setConfig(configYaml);
  };

  const handleEvaluate = async () => {
    try {
      toast("Starting Evaluation");
      const task = await apiClient.evaluateTrial(projectId, trialId, {
        full_ingest: false,
        skip_validation: true
      });

      console.log(task);
      toast.success("Evaluation Started");
      fetchTasks();
    } catch (error) {
      console.error("Error starting evaluation:", error);
      toast.error("Failed to start evaluation");
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

  return (
    <div className="w-full p-0 space-y-6">
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
            <BreadcrumbLink href={`/projects/${projectId}`}><b>{projectName || "Project Details"}</b></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{'Trial : ' + trial?.name || "Trial Details"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-ibm">
              {"Trial : " + trial?.name}
            </h1>
            <p className="text-sm text-gray-500">
              Created at:{" "}
              {trial?.created_at
                ? new Date(trial.created_at).toLocaleString()
                : "-"}
            </p>
          </div>
          <div className="space-x-4">
            <Button
              color="primary"
              disabled={trial?.status === "in_progress"}
              startContent={<PlayCircle size={16} />}
              onClick={() => handleRunTrial()}
            >
              Run Trial
            </Button>
            <Button
              color="secondary"
              disabled={trial?.status === "in_progress"}
              startContent={<PlayCircle size={16} />}
              onClick={() => handleRunTrial(true, false)}
            >
              Full Ingest
            </Button>
            <Button
              color="warning"
              disabled={trial?.status === "in_progress"}
              startContent={<PlayCircle size={16} />}
              onClick={handleValidate}
            >
              Validate
            </Button>
            <Button
              color="success"
              disabled={trial?.status === "in_progress"}
              startContent={<PlayCircle size={16} />}
              onClick={handleEvaluate}
            >
              Evaluate 
            </Button>
          </div>
        </div>
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
        <Tabs
          className="w-full"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList>

          <TabsTrigger className="flex items-center gap-2" value="tasks">
              <PlayCircle className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="qa_chunk_view">
              <Settings2 className="h-4 w-4" />
              qa_chunk_view
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="qa">
              <Settings2 className="h-4 w-4" />
              QA Creation
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="config">
              <Settings2 className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>


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
                <div className="flex items-center justify-between">
                  <CardTitle>Configuration</CardTitle>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white" variant="solid" onClick={handleConfigSave}>
                    Save Config
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border overflow-hidden">
                  <ConfigSelector onConfigSelect={handleConfigSelect} />
                  </div>
                <div className="border rounded-md overflow-hidden">
                  <ConfigEditor value={config}/>
                </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3 border-r pr-4">
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div
                            key={task.task_id}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                              selectedTask?.task_id === task.task_id ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => setSelectedTask(task)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium truncate" style={{maxWidth: "200px"}}>
                                  {task.task_id.substring(0, 8)}...
                                </div>
                                <div className="text-sm text-gray-500 capitalize">
                                  {task.type}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(task.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-9">
                      {selectedTask ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Task ID</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm font-mono">{selectedTask.task_id}</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Status</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(selectedTask.status)}
                                  <span className="capitalize">{selectedTask.status}</span>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Created At</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p>{new Date(selectedTask.created_at).toLocaleString()}</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Type</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="capitalize">{selectedTask.type}</p>
                              </CardContent>
                            </Card>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Save Directory</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm font-mono break-all">{selectedTask.save_dir || "N/A"}</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Output Files</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {selectedTask.corpus_path && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-mono break-all">{selectedTask.corpus_path}</span>
                                    <Button
                                      color="primary"
                                      size="sm"
                                      variant="flat"
                                      onClick={() => window.open(`/api/files${selectedTask.corpus_path}`, "_blank")}
                                    >
                                      View Corpus
                                    </Button>
                                  </div>
                                )}
                                {selectedTask.qa_path && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-mono break-all">{selectedTask.qa_path}</span>
                                    <Button
                                      color="secondary"
                                      size="sm"
                                      variant="flat"
                                      onClick={() => window.open(`/api/files${selectedTask.qa_path}`, "_blank")}
                                    >
                                      View QA
                                    </Button>
                                  </div>
                                )}
                                {selectedTask.config_path && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-mono break-all">{selectedTask.config_path}</span>
                                    <Button
                                      color="warning"
                                      size="sm"
                                      variant="flat"
                                      onClick={() => window.open(`/api/files${selectedTask.config_path}`, "_blank")}
                                    >
                                      View Config
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          Select a task to view details
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qa_chunk_view">
            <Card>
              <CardHeader>
                <CardTitle>qa_chunk_view</CardTitle>
              </CardHeader>
              <CardContent>
              {/* <ParquetQAAnalysis qaParquetUrl={selectedTask?.qa_path || ""} chunkParquetUrl={selectedTask?.corpus_path || "" }/> */}
              <ParquetViewer chunkParquetUrl={"http://localhost:3000/chunk.parquet" } qaParquetUrl={"http://localhost:3000/qa.parquet"}/>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Results & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                ?
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Toaster />
      </div>
    </div>
  );
}
