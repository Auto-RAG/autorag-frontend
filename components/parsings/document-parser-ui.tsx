"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { FileContents } from '../artifacts/artifacts-view-library';
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import { ResizablePanelGroup } from '../ui/resizable';
import { ScrollArea } from '../ui/scroll-area';

import DocumentViewer from './document-viewer';

import { cn } from '@/lib/utils';

interface ParsedData {
  texts: string;
  path: string;
  page: number;
  last_modified_datetime: Date;
}

const parsedData: ParsedData[] = [
  {
    texts: "Sample text from page 1",
    path: "/sample/path/1",
    page: 1,
    last_modified_datetime: new Date('2023-01-01T10:00:00Z')
  },
  {
    texts: "Sample text from page 2",
    path: "/sample/path/2",
    page: 2,
    last_modified_datetime: new Date('2023-01-02T10:00:00Z')
  },
  {
    texts: "Sample text from page 3",
    path: "/sample/path/3",
    page: 3,
    last_modified_datetime: new Date('2023-01-03T10:00:00Z')
  }
];

interface DocumentParserInterfaceProps {
  project_id: string;
  className?: string
}

export default function DocumentParserInterface({ project_id, className }: DocumentParserInterfaceProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [selectedFileContent, setSelectedFileContent] = useState<string | File | Blob>("");


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
        
      } catch (error) {
        console.error('Supporting only PDF file at viewer', error);

        toast.error("Now only supporting PDF file at viewer");
      }
    } else {
      toast.error("Now only supporting PDF file at viewer");
    }
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
            <FileContents projectId='william' onSelect={handleFileSelected} />
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
              <DocumentViewer file={selectedFileContent} />
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
                  {"Havertz Hevertz Havertz"}
                </pre>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
