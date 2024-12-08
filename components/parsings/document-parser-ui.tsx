"use client";

import React, { useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { ChevronRight, Copy, Folder, Maximize2, X } from 'lucide-react';

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
  className?: string
  file?: string
}

export function DocumentParserInterface({ className, file = '/sample.pdf' }: DocumentParserInterfaceProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

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
          <div className="flex items-center gap-2 p-2">
            <Folder className="h-4 w-4" />
            <span className={cn("font-medium", isCollapsed && "hidden")}>
              raw_data
            </span>
          </div>
          <ScrollArea className="flex-1">
            <FileContents projectId='william' onSelect={() => {}} />
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
              <div className="flex items-center justify-between border-b p-2">
                <h2 className="text-sm font-semibold">Input Document Image</h2>
                <div className="flex items-center gap-2">
                  <button className="rounded p-1 hover:bg-muted">
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </button>
                  <span className="text-sm">Page 1 of 15</span>
                  <button className="rounded p-1 hover:bg-muted">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="flex items-center justify-center p-4">
                  <div className="aspect-[1/1.4] w-full max-w-3xl rounded-lg bg-white shadow-lg">
                    {/* PDF content would go here */}
                    <div className="p-8">
                      <h1 className="mb-4 text-2xl font-bold">
                        Attention Is All You Need
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Sample PDF content would be rendered here
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* JSON Viewer */}
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-2">
                <h2 className="text-sm font-semibold">Response (JSON)</h2>
              </div>
              <ScrollArea className="flex-1">
                <pre className="p-4 font-mono text-sm">
                  {JSON.stringify(
                    {
                      0: {
                        text: "Sample text from page 1",
                        path: "/sample/path/1",
                        page: 1,
                        last_modified_datetime: {},
                      },
                      1: {
                        text: "Sample text from page 2",
                        path: "/sample/path/2",
                        page: 2,
                        last_modified_datetime: {},
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}




const ddDocumentParserInterface: React.FC<{ file?: string }> = ({ file = '/sample.pdf' }) => {
  const [showFullScreen, setShowFullScreen] = useState<'document' | 'json' | null>(null);
  const [query, setQuery] = useState('');
  const [sparrowKey, setSparrowKey] = useState('');

  const handleSubmitQuery = () => {
    // Query 처리 로직 구현
    console.log('Executing query:', query);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar for File Contents */}
      <aside className="w-64 bg-white border-r shadow-lg">
        <div className="h-full overflow-y-auto">
          <FileContents projectId='william' onSelect={() => {}} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-2">
        <div className="grid grid-cols-2 gap-4 h-[60vh]">
          {/* Original Document View */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="font-semibold">Input Document Image</h2>
              <button 
                className="p-1 hover:bg-gray-200 rounded"
                onClick={() => setShowFullScreen('document')}
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <DocumentViewer file={file} />
            </div>
          </div>

          {/* Parsed JSON View */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="font-semibold">Response (JSON)</h2>
              <div className="flex gap-2">
                <button 
                  className="p-1 hover:bg-gray-200 rounded"
                  onClick={() => copyToClipboard(JSON.stringify(parsedData, null, 2))}
                >
                  <Copy size={16} />
                </button>
                <button 
                  className="p-1 hover:bg-gray-200 rounded"
                  onClick={() => setShowFullScreen('json')}
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <JsonView data={parsedData} />
            </div>
          </div>
        </div>

        {/* Fullscreen Dialog */}
        {showFullScreen && (
          <Dialog open onOpenChange={() => setShowFullScreen(null)}>
            <div className="fixed inset-0 bg-black/50 z-50">
              <div className="fixed inset-4 bg-white rounded-lg flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-semibold">
                    {showFullScreen === 'document' ? 'Document View' : 'JSON View'}
                  </h2>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => setShowFullScreen(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {showFullScreen === 'document' ? (
                    <img 
                      alt="Original Document"
                      className="w-full h-auto" 
                      src="/api/placeholder/800/1000"
                    />
                  ) : (
                    <JsonView data={parsedData} />
                  )}
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}

// JSON Tree View 컴포넌트
const JsonView: React.FC<{ data: any }> = ({ data }) => {
  const renderValue = (value: any, path: string, key?: string) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'boolean') return <span className="text-blue-600">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="text-blue-600">{value}</span>;
    if (typeof value === 'string') return <span className="text-green-600">"{value}"</span>;
    
    const isArray = Array.isArray(value);
    
    return (
      <div>
        <div className="flex items-center gap-1">
          {key && <span className="text-purple-600">"{key}"</span>}
          <span>{isArray ? '[' : '{'}</span>
        </div>
        
        <div className="ml-4 border-l pl-2">
          {isArray ? (
            value.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-1">
                <span className="text-gray-500">{index}:</span>
                {renderValue(item, `${path}.${index}`)}
                {index < value.length - 1 && <span>,</span>}
              </div>
            ))
          ) : (
            Object.entries(value).map(([k, v], index, arr) => (
              <div key={k} className="flex items-start gap-1">
                {renderValue(v, `${path}.${k}`, k)}
                {index < arr.length - 1 && <span>,</span>}
              </div>
            ))
          )}
        </div>
        <div>{isArray ? ']' : '}'}</div>
      </div>
    );
  };

  return (
    <div className="font-mono text-sm p-4">
      {renderValue(data, 'root')}
    </div>
  );
};


export default DocumentParserInterface;
