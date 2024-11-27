"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import toast from "react-hot-toast";

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

interface ChunkConfig {
  module_type: string;
  chunk_method: string;
  chunk_size?: number;
  chunk_overlap?: number;
  embed_model?: string;
  add_file_name: string;
}

const tokenConfig: ChunkConfig = {
  "module_type": "llama_index_chunk",
  "chunk_method": "Token",
  "chunk_size": 512,
  "chunk_overlap": 128,
  "add_file_name": "en",
}

const recursiveConfig: ChunkConfig = {
  "module_type": "langchain_chunk",
  "chunk_method": "recursivecharacter",
  "chunk_size": 512,
  "chunk_overlap": 128,
  "add_file_name": "en",
}

const semanticConfig: ChunkConfig = {
  "module_type": "llama_index_chunk",
  "chunk_method": "Semantic_llama_index",
  "embed_model": "openai",
  "add_file_name": "en",
}

export function ChunkDialog({ open, onOpenChange, project_id }: ChunkDialogProps & { project_id: string }) {
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [selectedData, setSelectedData] = useState("");
  const [chunkMethod, setChunkMethod] = useState("token");
  const [embeddingModel, setEmbeddingModel] = useState("openai");
  const [config, setConfig] = useState(tokenConfig);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');
  
  useEffect(() => {
    const fetchParsedData = async () => {
      try {
        const response = await apiClient.getParsedDocuments(project_id);

        console.log("Parsed GET response: ", response);

        setParsedData(response.map((item) => ({
          id: item.parse_filepath,
          filename: item.parse_name,
        })));
        console.log("fetchParsedData");
      } catch (error) {
        console.error("Failed to fetch parsed data:", error);
      }
    };

    if (open) {
      fetchParsedData();
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      console.log('Chunk method:', chunkMethod);
      if (chunkMethod == "token") {
        setConfig(tokenConfig);
      } else if (chunkMethod == "recursive") {
        setConfig(recursiveConfig);
      } else if (chunkMethod == "semantic") {
        setConfig(semanticConfig);
      }

      if (Object.keys(config).length === 0) {
        toast.error('Please select a valid chunk method');

        return;
      }

      if (selectedData == "") {
        toast.error('Please select a valid parsed data');

        return;
      }

      const response = await apiClient.createChunkTask(project_id, {"name": "chunk_task", 
        "parsed_data_path": selectedData,
        "config": {"modules": [config]}});

      console.log('Chunk response:', response);
      toast.success('Successfully created chunk task');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create chunk task:', error);
      toast.error('Failed to create chunk task');
    }
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
                <RadioGroupItem id="token" value="token" />
                <Label htmlFor="token">Token</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="recursive" value="recursive" />
                <Label htmlFor="recursive">Recursive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="semantic" value="semantic" />
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
