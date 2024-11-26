"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ParseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ParseDialog({ open, onOpenChange }: ParseDialogProps) {
  const [fileType, setFileType] = useState("all");
  const [isMultiModal, setIsMultiModal] = useState(false);
  const [parserType, setParserType] = useState("pdf-reader");
  const [pdfReader, setPdfReader] = useState("pypdf");
  const [ocrModel, setOcrModel] = useState("tesseract");

  const handleSubmit = () => {
    const config = {
      fileType,
      isMultiModal,
      parserType,
      settings: {
        pdfReader: parserType === 'pdf-reader' ? pdfReader : undefined,
        ocrModel: parserType === 'ocr' ? ocrModel : undefined
      }
    };

    // TODO: Submit parse configuration
    console.log('Parse config:', config);
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
                <SelectItem value="all">All Supported Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="multimodal"
              checked={isMultiModal}
              onCheckedChange={(checked) => setIsMultiModal(checked as boolean)}
            />
            <Label htmlFor="multimodal">Enable Multi-modal Processing</Label>
          </div>

          <div className="grid gap-2">
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
          </div>

          {parserType === "pdf-reader" && (
            <div className="grid gap-2">
              <Label htmlFor="pdf-reader-select">PDF Reader</Label>
              <Select value={pdfReader} onValueChange={setPdfReader}>
                <SelectTrigger id="pdf-reader-select">
                  <SelectValue placeholder="Select PDF reader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pypdf">PyPDF</SelectItem>
                  <SelectItem value="pdfplumber">PDF Plumber</SelectItem>
                  <SelectItem value="pdfminer">PDFMiner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {parserType === "ocr" && (
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
          )}
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
