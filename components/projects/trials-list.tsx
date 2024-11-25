"use client";

import { useRouter } from "next/navigation";
import { format } from 'date-fns';
import { Badge, Beaker } from "lucide-react";

import { APIClient, Trial } from "@/lib/api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatLocalTime } from "@/lib/utils";

interface TrialsListProps {
  projectId: string;
}

async function fetchTrials(project_id: string) {
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  try {
    const trialsResponse = await apiClient.getTrials(project_id);
    let trials = trialsResponse.data;

    // Sort trials by creation date in descending order
    trials = trials.sort((a, b) => {
      const dateA = new Date(a.created_at.replace(/, /, ' '));
      const dateB = new Date(b.created_at.replace(/, /, ' '));

      return dateB.getTime() - dateA.getTime(); // Sort descending - newest first
    });

    return trials as Trial[];
  } catch (error) {
    console.error("Error fetching data:", error);

    return [];
  }
}

export async function TrialsList({
  projectId,
}: TrialsListProps) {
  const router = useRouter();
  const trials = await fetchTrials(projectId);

  const renderTrialsTable = (trials: Trial[], projectId: string) => {
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
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>CREATED AT</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trials.map((trial) => (
            <TableRow key={trial.id}>
              <TableCell>{trial.name}</TableCell>
              <TableCell>
                <Badge className={
                  trial.status === 'in_progress' ? 'bg-primary' :
                  trial.status === 'completed' ? 'bg-green-500' :
                  'bg-red-500'
                }>
                  {trial.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {format(new Date(trial.created_at), 'PPP')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatLocalTime(trial.created_at)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="default"
                  size="sm"
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
    <div className="space-y-6 p-6">
        <div className="rounded-md border">
          {renderTrialsTable(trials, projectId)}
        </div>
      </div>
  );
}
