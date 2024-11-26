"use client";

import React, { useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface QADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QADialog: React.FC<QADialogProps> = ({ open, onOpenChange }) => {
  const [preset, setPreset] = useState<string>("default");

  const handleCreate = () => {
    // Handle QA creation logic here
    onOpenChange(false);
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

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">QA Preset</label>
            <Select value={preset} onValueChange={setPreset}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreate}>Create QA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
