"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APIClient } from "@/lib/api-client";

interface ParseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function ParseDialog({ open, onOpenChange, projectId }: ParseDialogProps) {
  const [fileType, setFileType] = useState("*");
  // const [isMultiModal, setIsMultiModal] = useState(false);
  // const [parserType, setParserType] = useState("pdf-reader");
  const [pdfReader, setPdfReader] = useState("pypdf");
  // const [ocrModel, setOcrModel] = useState("tesseract");
  const [parseName, setParseName] = useState("");
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const handleSubmit = async () => {
    const parseConfig = {modules: [{
      module_type: "langchain_parse",
      file_type: "pdf",
      parse_method: pdfReader
    }]}

    const response = await apiClient.createParseTask(projectId, {
      name: parseName,
      extension: fileType,
      config: parseConfig,
      all_files: fileType === "*" ? true : false,
    });

    if (response.status === 400) {
      toast.error("The parse name is duplicated.");
      
      return;
    } else if (response.status === 500) {
      toast.error("Internal server error.");
      
      return;
    }

    toast.success("Parse started successfully.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Parse Configuration</DialogTitle>
          <DialogDescription>
            Currently supporting PDF, CSV, and DOCX file formats.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file-type">File Type</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger id="file-type">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="*">All Supported Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="parse-name">Parse Name</Label>
            <Input
              className="col-span-3"
              id="parse-name" 
              placeholder="Enter parse name"
              value={parseName}
              onChange={(e) => setParseName(e.target.value)}
            />
          </div>

          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="multimodal"
              checked={isMultiModal}
              onCheckedChange={(checked) => setIsMultiModal(checked as boolean)}
            />
            <Label htmlFor="multimodal">Enable Multi-modal Processing</Label>
          </div> */}

          {/* <div className="grid gap-2">
            <Label>Parser Type</Label>
            <RadioGroup value={parserType} onValueChange={setParserType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf-reader" id="pdf-reader" />
                <Label htmlFor="pdf-reader">PDF Reader</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ocr" id="ocr" />
                <Label htmlFor="ocr">OCR</Label>
              </div>
            </RadioGroup>
          </div> */}

          {/* {parserType === "pdf-reader" && ( */}
            <div className="grid gap-2">
              <Label htmlFor="pdf-reader-select">PDF Reader</Label>
              <Select value={pdfReader} onValueChange={setPdfReader}>
                <SelectTrigger id="pdf-reader-select">
                  <SelectValue placeholder="Select PDF reader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdfminer">PDFMiner</SelectItem>
                  <SelectItem value="pdfplumber">PDF Plumber</SelectItem>
                  <SelectItem value="pypdfium2">PyPDFium2</SelectItem>
                  <SelectItem value="pypdf">PyPDF</SelectItem>
                  <SelectItem value="pymupdf">PyMuPDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
          {/* )} */}

          {/* {parserType === "ocr" && (
            <div className="grid gap-2">
              <Label htmlFor="ocr-model">OCR Model</Label>
              <Select value={ocrModel} onValueChange={setOcrModel}>
                <SelectTrigger id="ocr-model">
                  <SelectValue placeholder="Select OCR model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tesseract">Tesseract</SelectItem>
                  <SelectItem value="easyocr">EasyOCR</SelectItem>
                  <SelectItem value="paddleocr">PaddleOCR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )} */}
        </div>
        <DialogFooter>
          <Button
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            type="submit"
            onClick={handleSubmit}
          >
            Start Parsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
