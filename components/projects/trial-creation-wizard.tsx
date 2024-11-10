"use client";

import { useState } from "react";
import { APIClient } from "@/lib/api-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrialFormData {
  name: string;
  config?: {
    modules: Array<{
      module_type: string;
      parse_method: string[];
    }>;
  };
}

export function CreateTrialDialog({
  isOpen,
  onOpenChange,
  projectId,
  onTrialCreated,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onTrialCreated: () => void;
}) {
  const [formData, setFormData] = useState<TrialFormData>({
    name: "",
    config: {
      modules: [
        {
          module_type: "langchain_parse",
          parse_method: ["pdfminer"]
        }
      ]
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      // TODO: Add proper validation feedback
      alert("Trial name is required");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create trial
      const response = await apiClient.createTrial(projectId, {
        name: formData.name,
        config: formData.config
      });

      console.log('Trial created:', response);
      onTrialCreated();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating trial:', error);
      alert('Failed to create trial');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Trial</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trialName">Trial Name</Label>
              <Input
                id="trialName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Enter trial name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parseMethod">Parse Method</Label>
              <Select
                value={formData.config?.modules[0].parse_method[0]}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  config: {
                    modules: [
                      {
                        ...prev.config!.modules[0],
                        parse_method: [value]
                      }
                    ]
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parse method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdfminer">PDFMiner</SelectItem>
                  {/* Add other parse methods as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? "Creating..." : "Create Trial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
