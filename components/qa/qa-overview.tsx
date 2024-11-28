"use client";

import { useState, useEffect } from "react";
import { Eye, Play, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { QADialog } from "./qa-dialog";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



interface QASet {
  name: string;
  chunked_name: string;
  qa_num: number;
  preset: string;
  llm_config: {
    llm_name: string;
    llm_params: Record<string, any>;
  };
  lang: string;
}

export function QAOverview({ projectId }: { projectId: string }) {
  const [qaSets, setQASets] = useState<QASet[]>([]);
  const [showQADialog, setShowQADialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setQASets([
      {
        name: "Basic Comprehension",
        chunked_name: "basic_comp_chunks",
        qa_num: 25,
        preset: "General Knowledge",
        llm_config: {
          llm_name: "gpt-4",
          llm_params: {}
        },
        lang: "en"
      },
      {
        name: "Technical Questions", 
        chunked_name: "tech_chunks",
        qa_num: 50,
        preset: "Programming",
        llm_config: {
          llm_name: "claude-2",
          llm_params: {}
        },
        lang: "en"
      },
      {
        name: "Customer Support",
        chunked_name: "support_chunks",
        qa_num: 100,
        preset: "Support",
        llm_config: {
          llm_name: "gpt-3.5-turbo",
          llm_params: {}
        },
        lang: "en"
      },
      {
        name: "Product Testing",
        chunked_name: "product_chunks", 
        qa_num: 75,
        preset: "Product",
        llm_config: {
          llm_name: "gpt-4",
          llm_params: {}
        },
        lang: "en"
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
            <TableRow key={qaSet.name}>
              <TableCell>{qaSet.name}</TableCell>
              <TableCell>{qaSet.qa_num}</TableCell>
              <TableCell>{qaSet.preset}</TableCell>
              <TableCell>{qaSet.llm_config.llm_name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    title="View Details"
                    variant="ghost"
                    onClick={() => router.push(`/projects/${projectId}/qa/${qaSet.name}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    title="Copy"
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
