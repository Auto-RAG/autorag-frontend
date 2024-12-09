"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

import { FileContents } from '../artifacts/artifacts-view-library';
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import { ResizablePanelGroup } from '../ui/resizable';
import { ScrollArea } from '../ui/scroll-area';

import DocumentViewer from './document-viewer';

import { cn } from '@/lib/utils';
import { APIClient } from '@/lib/api-client';

interface ParsedData {
  texts: string;
  path: string;
  page: number;
  last_modified_datetime: Date;
}

interface DocumentParserInterfaceProps {
  project_id: string;
  parsed_name: string;
  className?: string
}

export default function DocumentParserInterface({ project_id, parsed_name, className }: DocumentParserInterfaceProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState<string | File | Blob>("");
  const [parsedData, setParsedData] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');


  const handleFileSelected = async (nodeId: string) => {
    if (nodeId.includes('.pdf')) {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${project_id}/artifacts/content?filename=${nodeId}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/pdf'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch file');
          }

          const blob = await response.blob();
          
          setSelectedFileContent(blob);

          setSelectedFileName(nodeId);
        
      } catch (error) {
        console.error('Supporting only PDF file at viewer', error);

        toast.error("Now only supporting PDF file at viewer");
      }
    } else {
      toast.error("Now only supporting PDF file at viewer");
    }
    try{
      const parsedResponse = await apiClient.getParsedRow(project_id, parsed_name, nodeId, 1);

      setParsedData(parsedResponse.texts);
    } catch {
      toast.error("This file is not parsed in this parsed data.");
    }
      
  };

  const handlePageChanged = async (pageNum: number) => {
    const response = await apiClient.getParsedRow(project_id, parsed_name, selectedFileName, pageNum);

    setParsedData(response.texts);

  };

  return (
    <ResizablePanelGroup
      className={cn("overflow-auto items-stretch", className)}
      direction="horizontal"
    >
      {/* Sidebar */}
      <ResizablePanel
        className="min-w-[50px]"
        collapsible={true}
        defaultSize={20}
        maxSize={30}
        minSize={15}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
      >
        <div className="flex h-full flex-col bg-muted/50 p-2">
          <ScrollArea className="flex-1">
            <FileContents projectId={project_id} onSelect={handleFileSelected} />
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Main Content */}
      <ResizablePanel defaultSize={80}>
        <ResizablePanelGroup direction="horizontal">
          {/* PDF Viewer */}
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full flex-col">
              <DocumentViewer file={selectedFileContent} onPageChange={handlePageChanged}/>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* JSON Viewer */}
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-2">
                <h2 className="text-sm font-semibold">Parsed Text</h2>
              </div>
              <ScrollArea className="flex-1">
                <pre className="p-4 font-mono text-sm">
                  {parsedData}
                </pre>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
