"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table';
import { FileText, ChevronRight, Eye, Plus } from 'lucide-react';
import DocumentParserInterface from './document-parser-ui';

interface ParsedFile {
  id: string;
  filename: string;
  status: 'completed' | 'failed' | 'in_progress';
  parsed_at: string;
  file_type: string;
  file_size: string;
}

const ParseResultsContent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ParsedFile | null>(null);
  const [files] = useState<ParsedFile[]>([
    {
      id: '1',
      filename: 'lab_report_001.pdf',
      status: 'completed',
      parsed_at: '2024-03-15T10:30:00Z',
      file_type: 'PDF',
      file_size: '1.2 MB'
    },
    {
      id: '2',
      filename: 'medical_test_002.pdf',
      status: 'completed',
      parsed_at: '2024-03-15T11:15:00Z',
      file_type: 'PDF',
      file_size: '890 KB'
    },
    // ... 더 많은 파일들
  ]);

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
              <TableColumn>TYPE</TableColumn>
              <TableColumn>SIZE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>PARSED AT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      {file.filename}
                    </div>
                  </TableCell>
                  <TableCell>{file.file_type}</TableCell>
                  <TableCell>{formatFileSize(file.file_size)}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(file.status)}>
                      {file.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(file.parsed_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
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
              onClick={() => setSelectedFile(null)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={16} className="rotate-180" />
              Back to list
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText size={16} />
              {selectedFile.filename}
            </div>
          </div>
          
          <DocumentParserInterface />
        </div>
      )}
    </div>
  );
};

// Project Detail의 Parse 탭 내용 업데이트
const ParseTabContent: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Parsed Data</h1>
        <button className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md">
          <Plus size={16} />
          New Parse
        </button>
      </div>
      <ParseResultsContent />
    </div>
  );
};

export default ParseTabContent;
