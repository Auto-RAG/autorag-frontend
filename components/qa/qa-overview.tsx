"use client";

import { useState, useEffect } from "react";
import { Eye, Play, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QADialog } from "./qa-dialog";


interface QASet {
  id: string;
  name: string;
  qaPairs: number;
  preset: string;
  llm: string;
}

export function QAOverview({ projectId }: { projectId: string }) {
  const [qaSets, setQASets] = useState<QASet[]>([]);
  const [showQADialog, setShowQADialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setQASets([
      {
        id: "1",
        name: "Basic Comprehension",
        qaPairs: 25,
        preset: "General Knowledge",
        llm: "GPT-4"
      },
      {
        id: "2", 
        name: "Technical Questions",
        qaPairs: 50,
        preset: "Programming",
        llm: "Claude-2"
      },
      {
        id: "3",
        name: "Customer Support",
        qaPairs: 100,
        preset: "Support",
        llm: "GPT-3.5"
      },
      {
        id: "4",
        name: "Product Testing",
        qaPairs: 75,
        preset: "Product",
        llm: "GPT-4"
      }
    ]);
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button variant="default" onClick={() => setShowQADialog(true)}>
          + New QA
        </Button>
      </div>
      <QADialog
        open={showQADialog}
        onOpenChange={setShowQADialog}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>QA Pairs</TableHead>
            <TableHead>Preset</TableHead>
            <TableHead>LLM</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qaSets.map((qaSet) => (
            <TableRow key={qaSet.id}>
              <TableCell>{qaSet.name}</TableCell>
              <TableCell>{qaSet.qaPairs}</TableCell>
              <TableCell>{qaSet.preset}</TableCell>
              <TableCell>{qaSet.llm}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    title="View Details"
                    variant="ghost"
                    onClick={() => router.push(`/projects/${projectId}/qa/${qaSet.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    title="Use in Trial"
                    variant="ghost"
                    onClick={() => {}}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    title="Delete"
                    variant="ghost"
                    onClick={() => {}}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
