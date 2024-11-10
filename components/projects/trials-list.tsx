import { useState, useEffect, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { APIClient } from '@/lib/api-client';
import { UseQueryResult } from '@tanstack/react-query';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Badge, FlaskConical, MessagesSquare, MoreHorizontal, Plus, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

interface Trial {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "completed" | "failed";
  created_at: string;
  config_yaml: string;
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

interface TrialsListProps {
  projectId: string;
  trials: Trial[];
  setTrials: (trials: Trial[]) => void;
}

export function TrialsList({
  projectId,
  trials: propTrials,
  setTrials,
}: TrialsListProps) {
  const router = useRouter();
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  // 프로젝트 정보 가져오기
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => apiClient.getProject(projectId!),
    enabled: !!projectId,
  });

  console.log(project); 
  // 트라이얼 목록 가져오기
  const { 
    data: trials, 
  } = useQuery({
    queryKey: ['trials', projectId],
    queryFn: () => apiClient.getTrials(projectId!),
    enabled: !!projectId,
  });

  if (!project) {
    return <div>Loading project...</div>;
  }



  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      ??111
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project: {project.name}</h2>
          <p className="text-muted-foreground">
            Manage trials and monitor their performance
          </p>
        </div>
        <Button onClick={() => {/* 새 Trial 생성 로직 */}}>
          <Plus className="mr-2 h-4 w-4" />
          New Trial
        </Button>
      </div>
  
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trials</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total QA Pairs</CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trials.total_qa_pairs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trials.best_performance ? `${(trials.best_performance * 100).toFixed(1)}%` : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>
  
      {/* Trials List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Trial List</h3>
            <p className="text-sm text-muted-foreground">
              A list of all trials and their current status
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Filter options */}
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
  
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trial ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>QA Pairs</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trials.map((trial: { id: boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | Key | null | undefined; status: string; qa_pairs_count: any; performance_history: any; current_performance: number; created_at: any; last_activity: any; }) => (
                <TableRow>
                  <TableCell className="font-medium">{trial.id}</TableCell>
                  <TableCell>
                    <Badge className={
                      trial.status === 'active' ? 'bg-primary' :
                      trial.status === 'completed' ? 'bg-green-500' :
                      'bg-red-500'
                    }>
                      {trial.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{trial.qa_pairs_count || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {/* {trial.performance_history && (
                        <PerformanceMark data={trial.performance_history} />
                      )}
                      {typeof trial.current_performance === 'number' && (
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {`${(trial.current_performance * 100).toFixed(1)}%`}
                        </div>
                      )} */}
                    </div>
                  </TableCell>
                  {/* <TableCell>{FormData(trial.created_at)}</TableCell> */}
                  <TableCell>{trial.last_activity}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
  function useQuery(arg0: { queryKey: string[]; queryFn: () => any; enabled: boolean; }): { data: any; } {
    throw new Error("Function not implemented.");
  }
}
