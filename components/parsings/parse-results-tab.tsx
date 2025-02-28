"use client";

import React, { useEffect, useState } from 'react';
import { FileText, ChevronRight, Eye, Plus, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

import DocumentParserInterface from './document-parser-ui';
import { ParseDialog } from './parse-dialog';

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { APIClient } from '@/lib/api-client';

interface ParsedFile {
  parse_filepath: string;
  parse_name: string;
  module_name: string;
  module_params: string;
}

const ParseResultsContent: React.FC<{ project_id: string }> = ({ project_id }) => {
  const [selectedFile, setSelectedFile] = useState<ParsedFile | null>(null);
  const [files, setFiles] = useState<ParsedFile[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  useEffect(() => {
    const fetchParsedDocuments = async () => {
      try {
        const parsedDocs = await apiClient.getParsedDocuments(project_id);
        
        setFiles(parsedDocs);
      } catch (error) {
        console.error('Failed to fetch parsed documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParsedDocuments();
  }, []);
  
  return (
    <div className="space-y-4 h-full">
      {!selectedFile ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>MODULE</TableHead>
                <TableHead>PARAMS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.parse_filepath}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="text-gray-500" size={16} />
                      {file.parse_name}
                    </div>
                  </TableCell>
                  <TableCell>{file.module_name}</TableCell>
                  <TableCell>{file.module_params}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                        onClick={() => {
                          navigator.clipboard.writeText(file.parse_name);
                          toast.success("Parse name copied to the clipboard.\nPaste it in the chunk dialog to create a chunk.");
                        }}
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => setSelectedFile(file)}
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      ) : (
        <div className="space-y-4 h-full">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setSelectedFile(null)}
            >
              <ChevronRight className="rotate-180" size={16} />
              Back to list
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText size={16} />
              {selectedFile.parse_name}
            </div>
          </div>
          
          <DocumentParserInterface parsed_name={selectedFile.parse_name} project_id={project_id} />
        </div>
      )}
    </div>
  );
};

// Project Detail의 Parse 탭 내용 업데이트
const ParseTabContent: React.FC<{ project_id: string }> = ({ project_id }) => {
  const [showParseDialog, setShowParseDialog] = useState(false);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Parsed Data</h1>
        <button 
          className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md"
          onClick={() => setShowParseDialog(true)}
        >
          <Plus size={16} />
          New Parse
        </button>
      </div>
      <ParseDialog
        open={showParseDialog}
        projectId={project_id}
        onOpenChange={setShowParseDialog}
      />
      <ParseResultsContent project_id={project_id} />
    </div>
  );
};

export default ParseTabContent;
