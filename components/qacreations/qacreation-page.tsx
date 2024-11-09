import React, { useState } from "react";
import { ResponsiveContainer } from "recharts";
import { Edit, RefreshCw, Trash2, Plus } from "lucide-react";

import EvaluationRadarChat from "./../evaluation-radar-chart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

// 초기 데이터
const initialQAData = [
  {
    id: 1,
    question: "What is the capital of France?",
    knowledge:
      "France is a country in Western Europe. Paris is the capital and largest city of France.",
    answer: "Paris is the capital of France.",
    metrics: {
      grammar: 9,
      answer: 8,
      relevance: 9,
    },
  },
  // ... 더 많은 초기 데이터
];

const QADashboard = () => {
  const [qaData, setQaData] = useState(initialQAData);
  const [editingContent, setEditingContent] = useState({
    id: 1,
    type: 'type',
    content: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 메트릭스 평균 계산
  const averageMetrics = qaData.reduce(
    (acc, item) => {
      acc.grammar += item.metrics.grammar;
      acc.answer += item.metrics.answer;
      acc.relevance += item.metrics.relevance;

      return acc;
    },
    { grammar: 0, answer: 0, relevance: 0 },
  );

  // Object.keys(averageMetrics).forEach((key) => {
  //   averageMetrics[key] = +(averageMetrics[key] / qaData.length).toFixed(1);
  // });

  const chartData = [
    { subject: "Grammar", score: averageMetrics.grammar, fullMark: 10 },
    { subject: "Answer", score: averageMetrics.answer, fullMark: 10 },
    { subject: "Relevance", score: averageMetrics.relevance, fullMark: 10 },
  ];

  const EditDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit{" "}
            {/* {editingContent.type?.charAt(0).toUpperCase() +
              editingContent.type?.slice(1)} */}
          </DialogTitle>
        </DialogHeader>
        <Textarea
          className="min-h-[100px]"
          value={editingContent.content}
          onChange={(e) =>
            setEditingContent({
              ...editingContent,
              content: e.target.value,
            })
          }
        />
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="secondary"
              onClick={() =>
                setEditingContent({ id: 0, type: 'type', content: "" })
              }
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                setQaData(
                  qaData.map((item) =>
                    item.id === editingContent.id
                      ? {
                          ...item,
                          [editingContent.type as unknown as string]: editingContent.content,
                        }
                      : item,
                  ),
                );
                setEditingContent({ id: 0, type: 'type', content: "" });
              }}
            >
              Save
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>QA Analysis Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 items-center">
            <div className="w-64 h-44">
              <ResponsiveContainer height="100%" width="100%">
                <EvaluationRadarChat />
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        {/* Questions Column */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Questions</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                const newId = Math.max(...qaData.map((item) => item.id)) + 1;

                setQaData([
                  ...qaData,
                  {
                    id: newId,
                    question: "New Question",
                    knowledge: "Knowledge will be generated",
                    answer: "New Answer",
                    metrics: { grammar: 0, answer: 0, relevance: 0 },
                  },
                ]);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {qaData.map((item) => (
                  <TableRow key={`question-${item.id}`}>
                    <TableCell className="align-top">
                      <div className="flex justify-between items-start">
                        <span className="text-sm">{item.question}</span>
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingContent({
                                id: item.id || 0,
                                type: "question",
                                content: item.question || "",
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              alert("Regenerating question...");
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Knowledge Column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Knowledge Chunks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {qaData.map((item) => (
                  <TableRow key={`knowledge-${item.id}`}>
                    <TableCell className="align-top">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">
                          {item.knowledge}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setQaData(qaData.filter((q) => q.id !== item.id))
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Answers Column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {qaData.map((item) => (
                  <TableRow key={`answer-${item.id}`}>
                    <TableCell className="align-top">
                      <div className="flex justify-between items-start">
                        <span className="text-sm">{item.answer}</span>
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingContent({
                                id: item.id,
                                type: "answer",
                                content: item.answer,
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              alert("Regenerating answer...");
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <EditDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default QADashboard;
