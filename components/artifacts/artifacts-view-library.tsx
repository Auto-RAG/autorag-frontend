import React, { useEffect, useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import Box from '@mui/material/Box';

interface FileNode {
  name: string;
  type: 'directory' | 'file';
  children?: FileNode[];
}

interface TreeItem {
  index: number;
  canMove: boolean;
  hasChildren: boolean;
  children: string[];
  data: string;
  canRename: boolean;
  isFolder: boolean;
}

interface TreeItems {
  [key: string]: TreeItem;
}

const ArtifactsView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);

  const handleSelect = async (nodeId: string) => {
    if (nodeId.includes('.pdf')) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/projects/${projectId}/artifacts/content?path=${nodeId}`);
        const content = await response.text();
        setSelectedFileContent(content);
      } catch (error) {
        console.error('Error fetching file content:', error);
        setSelectedFileContent('Error loading file content');
      }
    }
  };

  return (
    <div className="h-[500px] bg-white rounded-lg shadow-sm border p-4">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="overflow-auto border rounded p-2">
          <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <SimpleTreeView>
              <TreeItem itemId="raw_data" label={
                <div className="flex items-center gap-2 py-1">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">raw_data</span>
                </div>
              }>
                <TreeItem itemId="raw_data-baseball_1.pdf" label={
                  <div className="flex items-center gap-2 py-1">
                    <File className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">baseball_1.pdf</span>
                  </div>
                } />
                <TreeItem itemId="raw_data-korean_texts_two_page.pdf" label={
                  <div className="flex items-center gap-2 py-1">
                    <File className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">korean_texts_two_page.pdf</span>
                  </div>
                } />
              </TreeItem>
            </SimpleTreeView>
          </Box>
        </div>
        <div className="overflow-auto border rounded p-2">
          {selectedFileContent ? (
            <pre className="text-sm whitespace-pre-wrap">{selectedFileContent}</pre>
          ) : (
            <div className="text-gray-500 text-sm">Select a file to view its contents</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtifactsView;