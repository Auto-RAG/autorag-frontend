"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";

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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { APIClient } from "@/lib/api-client";

interface ChunkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedData {
  id: string;
  filename: string;
}

export function ChunkDialog({ open, onOpenChange }: ChunkDialogProps) {
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [selectedData, setSelectedData] = useState("");
  const [chunkMethod, setChunkMethod] = useState("token");
  const [embeddingModel, setEmbeddingModel] = useState("openai");

  useEffect(() => {
    const fetchParsedData = async () => {
      try {
        // const response = await APIClient.get("/api/parsed-data");
        // setParsedData(response.data);
        console.log("fetchParsedData");
      } catch (error) {
        console.error("Failed to fetch parsed data:", error);
      }
    };

    if (open) {
      fetchParsedData();
    }
  }, [open]);

  const handleSubmit = () => {
    const config = {
      parsedDataId: selectedData,
      chunkMethod,
      settings: {
        embeddingModel: chunkMethod === 'semantic' ? embeddingModel : undefined
      }
    };

    console.log('Chunk config:', config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Chunk</DialogTitle>
          <DialogDescription>
            Create new chunks from your parsed data using various chunking methods.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="parsed-data">Parsed Data</Label>
            <Select value={selectedData} onValueChange={setSelectedData}>
              <SelectTrigger id="parsed-data">
                <SelectValue placeholder="Select parsed data" />
              </SelectTrigger>
              <SelectContent>
                {parsedData.map((data) => (
                  <SelectItem key={data.id} value={data.id}>
                    {data.filename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Chunk Method</Label>
            <RadioGroup value={chunkMethod} onValueChange={setChunkMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="token" id="token" />
                <Label htmlFor="token">Token</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recursive" id="recursive" />
                <Label htmlFor="recursive">Recursive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="semantic" id="semantic" />
                <Label htmlFor="semantic">Semantic</Label>
              </div>
            </RadioGroup>
          </div>

          {chunkMethod === "semantic" && (
            <div className="grid gap-2">
              <Label htmlFor="embedding-model">Embedding Model</Label>
              <Select value={embeddingModel} onValueChange={setEmbeddingModel}>
                <SelectTrigger id="embedding-model">
                  <SelectValue placeholder="Select embedding model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="cohere">Cohere</SelectItem>
                  <SelectItem value="huggingface">HuggingFace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            type="submit"
            onClick={handleSubmit}
          >
            Create Chunks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
