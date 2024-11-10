"use client";

import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import {
  PlusIcon,
  Beaker,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlayCircle,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

import { CreateProjectDialog } from "./create-project-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
;
import { 
  APIClient,
  Project,
  PerformancePoint, 
  ProjectStats,
  ProjectList
} from '@/lib/api-client';
interface PreparationStatus {
  parse: "not_started" | "in_progress" | "completed" | "failed";
  chunk: "not_started" | "in_progress" | "completed" | "failed";
  qa: "not_started" | "in_progress" | "completed" | "failed";
}

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   status: 'active' | 'archived';
//   created_at: string;
//   updated_at: string;
//   trials_count: number;
//   active_trials: number;
//   total_qa_pairs: number;
//   preparation_status: PreparationStatus;
//   last_activity: string;
// }

// interface PerformancePoint {
//   date: string;
//   score: number;
// }

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   status: "active" | "archived";
//   created_at: string;
//   updated_at: string;
//   trials_count: number;
//   active_trials: number;
//   total_qa_pairs: number;
//   preparation_status: PreparationStatus;
//   last_activity: string;
//   performance_history: PerformancePoint[];
//   current_performance: number;
// }

// 목업 데이터에 성능 이력 추가
const mockProjects: ProjectList = {
  total: 2,
  projects: [
  {
    id: "1",
    name: "[Demo] Research Papers QA",
    description: "QA system for academic papers",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
    trials_count: 5,
    active_trials: 2,
    total_qa_pairs: 1250,
    preparation_status: {
      parse: "completed",
      chunk: "completed",
      qa: "in_progress",
    },
    last_activity: "2024-03-10T15:30:00Z",
    performance_history: [
      { date: "2024-01-01", score: 0.65 },
      { date: "2024-01-15", score: 0.72 },
      { date: "2024-02-01", score: 0.78 },
      { date: "2024-02-15", score: 0.82 },
      { date: "2024-03-01", score: 0.85 },
    ],
    current_performance: 0.85,
  },
  {
    id: "2",
    name: "[Demo] Medical Documentation",
    description: "Medical records analysis system",
    status: "active",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    trials_count: 3,
    active_trials: 1,
    total_qa_pairs: 850,
    preparation_status: {
      parse: "completed",
      chunk: "completed",
      qa: "completed",
    },
    last_activity: "2024-03-11T09:15:00Z",
    performance_history: [
      { date: "2024-01-15", score: 0.7 },
      { date: "2024-02-01", score: 0.75 },
      { date: "2024-02-15", score: 0.79 },
      { date: "2024-03-01", score: 0.88 },
    ],
    current_performance: 0.88,
  },
  // ... 다른 프로젝트들에 대해서도 비슷한 패턴으로 performance_history 추가 ...
]};

// // 목업 데이터
// const mockProjects: Project[] = [
//   {
//     id: '1',
//     name: 'Research Papers QA',
//     description: 'QA system for academic papers',
//     status: 'active',
//     created_at: '2024-01-01T00:00:00Z',
//     updated_at: '2024-02-15T00:00:00Z',
//     trials_count: 5,
//     active_trials: 2,
//     total_qa_pairs: 1250,
//     preparation_status: {
//       parse: 'completed',
//       chunk: 'completed',
//       qa: 'in_progress'
//     },
//     last_activity: '2024-03-10T15:30:00Z'
//   },
//   {
//     id: '2',
//     name: 'Medical Documentation',
//     description: 'Medical records analysis system',
//     status: 'active',
//     created_at: '2024-01-15T00:00:00Z',
//     updated_at: '2024-03-01T00:00:00Z',
//     trials_count: 3,
//     active_trials: 1,
//     total_qa_pairs: 850,
//     preparation_status: {
//       parse: 'completed',
//       chunk: 'completed',
//       qa: 'completed'
//     },
//     last_activity: '2024-03-11T09:15:00Z'
//   },
//   {
//     id: '3',
//     name: 'Legal Contract Analysis',
//     description: 'Contract review and QA generation',
//     status: 'archived',
//     created_at: '2023-12-01T00:00:00Z',
//     updated_at: '2024-01-30T00:00:00Z',
//     trials_count: 7,
//     active_trials: 0,
//     total_qa_pairs: 2100,
//     preparation_status: {
//       parse: 'completed',
//       chunk: 'failed',
//       qa: 'not_started'
//     },
//     last_activity: '2024-03-09T11:45:00Z'
//   },
//   {
//     id: '4',
//     name: 'Technical Documentation',
//     description: 'API documentation QA system',
//     status: 'active',
//     created_at: '2024-02-01T00:00:00Z',
//     updated_at: '2024-03-05T00:00:00Z',
//     trials_count: 2,
//     active_trials: 2,
//     total_qa_pairs: 450,
//     preparation_status: {
//       parse: 'completed',
//       chunk: 'completed',
//       qa: 'completed'
//     },
//     last_activity: '2024-03-11T14:20:00Z'
//   },
//   {
//     id: '5',
//     name: 'Educational Content',
//     description: 'Learning materials QA generator',
//     status: 'active',
//     created_at: '2024-02-15T00:00:00Z',
//     updated_at: '2024-03-10T00:00:00Z',
//     trials_count: 4,
//     active_trials: 1,
//     total_qa_pairs: 750,
//     preparation_status: {
//       parse: 'in_progress',
//       chunk: 'not_started',
//       qa: 'not_started'
//     },
//     last_activity: '2024-03-11T16:30:00Z'
//   }
// ];

const StatusIcon = ({ status }: { status?: string }) => {
  if (!status) {
    return <AlertCircle className="h-4 w-4 text-gray-300" />;
  }

  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "in_progress":
      return <PlayCircle className="h-4 w-4 text-blue-500" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

// 스파크라인 차트 컴포넌트
const PerformanceSparkline = ({ data }: { data: PerformancePoint[] }) => {
  return (
    <div className="w-24 h-12">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data}>
          <YAxis hide domain={[0.5, 1]} />
          <Line
            dataKey="score"
            dot={false}
            isAnimationActive={false}
            stroke="#16a34a"
            strokeWidth={2}
            type="monotone"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                // payload.length > 0으로 수정
                return (
                  <div className="bg-white border rounded-lg shadow-lg p-2 text-xs">
                    {payload && payload.length > 0 ? ( // payload가 정의되어 있는지 확인
                      <>
                        <p className="text-gray-500">
                          {payload[0].payload.date}
                        </p>
                      </>
                    ) : null}
                  </div>
                );
              }

              return null;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const calculateProjectStats = (projects: Project[]): ProjectStats => {
  return projects.reduce((stats, project) => ({
    total_projects: stats.total_projects + 1,
    active_projects: project.status === 'active' 
      ? stats.active_projects + 1 
      : stats.active_projects,
    total_trials: stats.total_trials + (project.trials_count || 0),
    active_trials: stats.active_trials + (project.active_trials || 0),
    total_qa_pairs: stats.total_qa_pairs + (project.total_qa_pairs || 0),
  }), {
    total_projects: 0,
    active_projects: 0,
    total_trials: 0,
    active_trials: 0,
    total_qa_pairs: 0,
  });
};

export function Projects() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectList, setProjectList] = useState<{ total: number; data: Project[] }>({
    total: 0,
    data: []
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProjectStats>({
    total_projects: 0,
    active_projects: 0,
    total_trials: 0,
    active_trials: 0,
    total_qa_pairs: 0,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  useEffect(() => {
    loadProjects();
    console.log(process.env.NEXT_PUBLIC_API_URL);
  }, []);

  useEffect(() => {
    const newStats = calculateProjectStats(projectList.data);
    setStats(newStats);
  }, [projectList.data]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProjects(page);
      console.log('API Response:', response);
      
      // response와 response.data가 있는지 확인
      if (response && Array.isArray(response.data)) {
        const tempData = [...response.data, ...mockProjects.projects];
        setProjectList(prev => ({
          total: tempData.length || 0,
          data: [...prev.data, ...tempData]
        }));
        setHasMore(response.data.length === 10);
      } else {
        console.warn('Invalid API response format:', response);
        setProjectList({ total: mockProjects.projects.length, data: mockProjects.projects });
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjectList({ total: mockProjects.projects.length, data: mockProjects.projects });
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }; 

  const handleProjectCreated = (project: Project) => {
    setProjectList(prev => ({ ...prev, data: [project, ...prev.data] }));
    setIsCreateOpen(false);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);

      return `${minutes}m ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);

      return `${hours}h ago`;
    } else {
      const days = Math.floor(seconds / 86400);

      return `${days}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your AutoRAG projects and trials
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_projects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_projects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trials</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_trials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total QA Pairs
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total_qa_pairs}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_projects - stats.active_projects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>
            A list of all your projects including their trials and preparation
            status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table aria-label="Projects table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TRIALS</TableColumn>
              <TableColumn>QA PAIRS</TableColumn>
              <TableColumn>PREPARATION STATUS</TableColumn>
              <TableColumn>PERFORMANCE</TableColumn>
              <TableColumn>LAST ACTIVITY</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {projectList.data.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500">
                        {project.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === "active" ? "default" : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {project.trials_count} trials
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.active_trials} active
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{project.total_qa_pairs}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Parse</span>
                        <StatusIcon status={project.preparation_status?.parse} />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Chunk</span>
                        <StatusIcon status={project.preparation_status?.chunk} />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">QA</span>
                        <StatusIcon status={project.preparation_status?.qa} />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {project.performance_history && (
                          <PerformanceSparkline
                            data={project.performance_history}
                          />
                        )}
                        {typeof project.current_performance === 'number' && (
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {`${(project.current_performance * 100).toFixed(1)}%`}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {project.last_activity 
                        ? getTimeAgo(project.last_activity)
                        : 'No activity'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/projects/${project.id}/`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onProjectCreated={(project) => {
          setProjectList(prev => ({
            total: prev.total + 1,
            data: [...prev.data, project]
          }));
          setIsCreateOpen(false);
        }}
      />
    </div>
  );
}
