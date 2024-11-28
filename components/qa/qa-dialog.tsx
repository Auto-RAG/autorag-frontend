"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { APIClient } from '@/lib/api-client';

interface QADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const gpt_4o_config = {
  llm_name: "openai_llm",
  llm_params: {
    llm: "gpt-4o",
  }
}

const gpt_4o_mini_config = {
  llm_name: "openai_llm",
  llm_params: {
    llm: "gpt-4o-mini",
  }
}

export const QADialog: React.FC<QADialogProps> = ({ open, onOpenChange, projectId }) => {
  const [preset, setPreset] = useState<string>("default");
  const [qaName, setQaName] = useState<string>("");
  const [chunkedName, setChunkedName] = useState<string>("");
  const [qaNum, setQaNum] = useState<number>(100);
  const [llmConfig, setLlmConfig] = useState<{llm_name: string, llm_params: Record<string, any>}>({llm_name: "", llm_params: {}});
  const [lang, setLang] = useState<string>("en");
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const handleCreate = async () => {
    const res = await apiClient.createQATask(projectId, {
      preset: preset,
      name: qaName,
      chunked_name: chunkedName,
      qa_num: qaNum,
      llm_config: llmConfig,
      lang: lang
    });

    if (res.status === "success") {
      toast.success("QA task created successfully");
      onOpenChange(false);
    } else if (res.status === 400 || res.status === 401) {
      toast.error(res.error);
    }
    else {
      toast.error("Failed to create QA task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New QA</DialogTitle>
          <DialogDescription>
            Create a new QA session with your selected configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1 py-1">
            <label className="text-sm font-medium">QA Name</label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter QA name"
              type="text"
              value={qaName}
              onChange={(e) => setQaName(e.target.value)}
            />
        </div>

        <div className="grid gap-1 py-1">
            <label className="text-sm font-medium">Chunked Name</label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter chunked name"
              type="text"
              value={chunkedName}
              onChange={(e) => setChunkedName(e.target.value)}
            />
        </div>

        <div className="grid gap-1 py-1">
            <label className="text-sm font-medium">QA Preset</label>
            <Select value={preset} onValueChange={setPreset}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div className="grid gap-1 py-2">
            <label className="text-sm font-medium">Number of QA Pairs</label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              placeholder="Enter number of QA pairs"
              type="number"
              value={qaNum}
              onChange={(e) => setQaNum(parseInt(e.target.value))}
            />
        </div>

        <div className="grid gap-1 py-1">
            <label className="text-sm font-medium">LLM Model</label>
            <Select value={JSON.stringify(llmConfig)} onValueChange={(value) => setLlmConfig(JSON.parse(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select LLM model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={JSON.stringify(gpt_4o_config)}>GPT-4o</SelectItem>
                <SelectItem value={JSON.stringify(gpt_4o_mini_config)}>GPT-4o-mini</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div className="grid gap-1 py-1">
            <label className="text-sm font-medium">Language</label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <DialogFooter>
          <Button onClick={handleCreate}>Create QA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
