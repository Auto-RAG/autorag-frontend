"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEFAULT_YAML_CONFIG = `# AutoRAG Trial Configuration
version: 1.0

parsing:
  parser_type: pdf
  chunk_size: 1000
  overlap: 200

chunking:
  method: sentence
  chunk_size: 500
  overlap: 50

validation:
  metrics:
    - accuracy
    - f1_score
  threshold:
    accuracy: 0.8
    f1_score: 0.75

eval:
  eval_metrics:
    - precision
    - recall
    - response_quality
  test_split: 0.2

reporting:
  format: html
  metrics:
    - accuracy
    - latency
    - resource_usage

live_chat:
  model: gpt-4
  temperature: 0.7
  max_tokens: 2000`;

const YAML_TEMPLATES = {
  basic: `# Basic Configuration
version: 1.0
parsing:
  parser_type: pdf
  chunk_size: 1000
chunking:
  method: simple
  chunk_size: 500
validation:
  metrics: [accuracy]
eval:
  eval_metrics: [precision, recall]`,

  advanced: `# Advanced Configuration
version: 1.0
parsing:
  parser_type: pdf
  chunk_size: 1000
  overlap: 200
  clean_text: true
chunking:
  method: sentence
  chunk_size: 500
  overlap: 50
  min_chunk_size: 100
validation:
  metrics:
    - accuracy
    - f1_score
    - response_quality
  threshold:
    accuracy: 0.85
    f1_score: 0.8
eval:
  eval_metrics:
    - precision
    - recall
    - latency
    - resource_usage
  test_split: 0.2`,

  experimental: `# Experimental Configuration
version: 1.0
parsing:
  parser_type: smart_pdf
  chunk_size: dynamic
  clean_text: true
  extract_tables: true
chunking:
  method: semantic
  embedding_model: sentence-transformers
  similarity_threshold: 0.85
validation:
  metrics:
    - semantic_similarity
    - answer_relevance
    - factual_accuracy
  custom_metrics:
    coherence_score: true
eval:
  eval_metrics:
    - gpt4_evaluation
    - human_feedback
    - response_diversity`,
};

interface CreateTrialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onTrialCreated: (trial: any) => void;
}

export function CreateTrialDialog({
  open,
  onOpenChange,
  projectId,
  onTrialCreated,
}: CreateTrialDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [configYaml, setConfigYaml] = useState(DEFAULT_YAML_CONFIG);
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    if (template !== "custom") {
      setConfigYaml(YAML_TEMPLATES[template as keyof typeof YAML_TEMPLATES]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/trials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          config_yaml: configYaml,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create trial");
      }

      const trial = await response.json();

      onTrialCreated(trial);
      setName("");
      setDescription("");
      setConfigYaml(DEFAULT_YAML_CONFIG);
    } catch (error) {
      console.error("Error creating trial:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Trial</DialogTitle>
          <DialogDescription>
            Configure a new trial for your project. You can use a template or
            create a custom configuration.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="basic">
            <div className="grid w-full gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Trial Name</Label>
                <Input
                  id="name"
                  placeholder="Enter trial name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter trial description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Template</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Template</SelectItem>
                    <SelectItem value="advanced">Advanced Template</SelectItem>
                    <SelectItem value="experimental">
                      Experimental Template
                    </SelectItem>
                    <SelectItem value="custom">Custom Configuration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent className="space-y-4" value="config">
            <div className="grid gap-2">
              <Label>YAML Configuration</Label>
              <div className="border rounded-md">
                <Editor
                  defaultLanguage="yaml"
                  height="400px"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    rulers: [80],
                    wordWrap: "on",
                  }}
                  value={configYaml}
                  onChange={(value) => setConfigYaml(value || "")}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={isLoading || !name.trim() || !configYaml.trim()}
            onClick={handleSubmit}
          >
            {isLoading ? "Creating..." : "Create Trial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
