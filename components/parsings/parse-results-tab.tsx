"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table';
import { FileText, ChevronRight, Eye, Plus } from 'lucide-react';

import DocumentParserInterface from './document-parser-ui';
import { ParseDialog } from './parse-dialog';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in_progress':
        return 'text-blue-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };
  
  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div className="bg-white rounded-lg shadow">
          <Table aria-label="Parsed files list">
            <TableHeader>
              <TableColumn>FILENAME</TableColumn>
              <TableColumn>MODULE</TableColumn>
              <TableColumn>PARAMETERS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
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
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => setSelectedFile(file)}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="space-y-4">
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
          
          <DocumentParserInterface />
        </div>
      )}
    </div>
  );
};

// Project Detail의 Parse 탭 내용 업데이트
const ParseTabContent: React.FC<{ project_id: string }> = ({ project_id }) => {
  const [showParseDialog, setShowParseDialog] = useState(false);

  return (
    <div>
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
        onOpenChange={setShowParseDialog}
      />
      <ParseResultsContent project_id={project_id} />
    </div>
  );
};

export default ParseTabContent;
