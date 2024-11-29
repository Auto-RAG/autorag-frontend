"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadFiles } from "@/lib/utils";

export function UploadDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    setFiles(files);

    toast.success(`Selected ${files?.length} files`);
  };

  const onUpload = (files: FileList) => {
    uploadFiles(projectId, files, () => {
      toast.success(`Uploaded ${files?.length} files`);
    }, () => {
      toast.error('Failed to upload files');
    });
  }

  const onClickUpload = () => {
    if (files) {
      onUpload(files);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="files">Files</Label>
          <Input
            multiple
            className="cursor-pointer"
            id="files"
            type="file"
            onChange={handleFileChange}
          />
          <p className="text-sm text-muted-foreground">
            Select one or more files to upload.
          </p>
          <Button className="mt-4" onClick={onClickUpload}>
            Start Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
