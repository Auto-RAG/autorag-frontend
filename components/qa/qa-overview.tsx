"use client";

import { useState, useEffect } from "react";
import { Eye, Play, Trash2 } from "lucide-react";

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
  id: string;
  name: string;
  qaPairs: number;
  preset: string;
  llm: string;
}

export function QAOverview({ projectId }: { projectId: string }) {
  const [qaSets, setQASets] = useState<QASet[]>([]);

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
        <Button variant="default">+ New QA</Button>
      </div>
      
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
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                    title="Use in Trial"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                    title="Delete"
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
