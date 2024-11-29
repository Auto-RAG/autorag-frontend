"use client";

import { useRouter } from "next/navigation";
import { format } from 'timeago.js';
import { Beaker } from "lucide-react";
import { useEffect, useState } from "react";

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
import { formatLocalTime, getStatusColor } from "@/lib/utils";


async function fetchTrials(project_id: string) {
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  try {
    const trialsResponse = await apiClient.getTrials(project_id);
    var trials = trialsResponse.data;

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

export function TrialsList({
  projectId, isTrial = true
}: {projectId: string, isTrial?: boolean}) {
  const router = useRouter();

  const [trials, setTrials] = useState<Trial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrials = async () => {
      const trialResponse = await fetchTrials(projectId);
      
      setTrials(trialResponse);
      setIsLoading(false);
    };

    loadTrials();
  }, [projectId]);
  

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
                  size="sm"
                  variant="default"
                  onClick={() =>
                    router.push(`/${isTrial ? 'projects' : 'service'}/${projectId}/${isTrial ? 'trials' : 'version'}/${trial.id}`)
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

  if (!isLoading) {
    return (
    <div className="space-y-6 p-6">
        <div className="rounded-md border">
          {renderTrialsTable(trials, projectId)}
        </div>
      </div>
  );
}
}
