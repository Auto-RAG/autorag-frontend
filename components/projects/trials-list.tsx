import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getStatusColor } from "../../utils/status";

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
  const [trials, setLocalTrials] = useState<Trial[]>(propTrials || mockTrials);

  useEffect(() => {
    // 실제 API 호출 시 사용
    // const fetchTrials = async () => {
    //   try {
    //     const response = await fetch(`/api/projects/${projectId}/trials`);
    //     const data = await response.json();
    //     setLocalTrials(data);
    //     if (setTrials) setTrials(data);
    //   } catch (error) {
    //     console.error('Error fetching trials:', error);
    //   }
    // };
    // fetchTrials();

    // 목업 데이터 사용
    if (!propTrials) {
      setLocalTrials(mockTrials);
      if (setTrials) setTrials(mockTrials);
    }
  }, [projectId, propTrials, setTrials]);

  const handleViewDetails = (trialId: string) => {
    router.push(`/projects/${projectId}/trials/${trialId}`);
  };

  const handleViewLogs = (trialId: string) => {
    // 로그 보기 구현
    console.log(`Viewing logs for trial ${trialId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trials</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>CREATED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trials.map((trial) => (
                <TableRow key={trial.id}>
                  <TableCell className="font-medium">{trial.name}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        trial.status,
                      )}`}
                    >
                      {trial.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(trial.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      className="mr-2"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        /* View logs */
                      }}
                    >
                      Logs
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        /* View details */
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
