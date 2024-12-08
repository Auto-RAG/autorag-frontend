"use client";

import React, { useEffect, useState } from 'react';
import { File, Folder, X } from 'lucide-react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import Box from '@mui/material/Box';
import { toast } from 'react-hot-toast';

import DocumentViewer from '../parsings/document-viewer';

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

export const FileContents: React.FC<{
  projectId: string;
  onSelect: (nodeId: string) => void;
  onDelete?: (filename: string) => void;
}> = ({ projectId, onSelect, onDelete }) => {
  const [treeContent, setTreeContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/artifacts`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch artifacts');
        }
        const data = await response.json();
        const fileNode: FileNode = {
          name: data.name,
          type: data.type,
          children: data.children?.map((child: any) => ({
            name: child.name,
            type: child.type,
            children: child.children
          }))
        };

        const treeView = (
          <SimpleTreeView>
            {renderTreeItems(fileNode)}
          </SimpleTreeView>
        );
        
        setTreeContent(treeView);
      } catch (error) {
        console.error('Error fetching artifacts:', error);
        setTreeContent(<div>Error loading file tree</div>);
      }
    };

    const renderTreeItems = (node: FileNode) => {
      if (node.type === 'directory') {
        return (
          <TreeItem 
            key={node.name}
            itemId={node.name} 
            label={
              <div className="flex items-center gap-2 py-1">
                <Folder className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{node.name}</span>
              </div>
            }
          >
            {node.children?.map(child => renderTreeItems(child))}
          </TreeItem>
        );
      }
      
      return (
        <TreeItem
          key={node.name}
          itemId={node.name}
          label={
            <div className="flex items-center justify-between gap-2 py-1 group">
              <div className="flex items-center gap-2" onClick={() => onSelect(node.name)}>
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{node.name}</span>
              </div>
              {onDelete && (
                <button
                  className="hidden group-hover:block text-red-500 hover:text-red-700 px-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent file selection when clicking delete
                    onDelete(node.name);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          }
        />
      );
    };

    fetchContents();
  }, [projectId, onSelect, onDelete]);

  return treeContent;
};

const ArtifactsView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [selectedFileContent, setSelectedFileContent] = useState<string | null | Blob>(null);

  const handleSelect = async (nodeId: string) => {
    if (nodeId.includes('.pdf')) {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/artifacts/content?filename=${nodeId}`, {
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
      }
    }
  };

  const handleDelete = async (filename: string) => {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/artifacts/content?filename=${filename}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete file');
        }

        // Show success message
        toast.success("File deleted. Please refresh.");
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  return (
    <div className="h-[500px] bg-white rounded-lg shadow-sm border p-4">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="overflow-auto border rounded p-2">
          <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <FileContents
              projectId={projectId} 
              onDelete={handleDelete} 
              onSelect={handleSelect}
            />
          </Box>
        </div>
        <div className="overflow-auto border rounded p-2">
          {selectedFileContent ? (
            <DocumentViewer file={selectedFileContent} onPageChange={() => {}}/>
          ) : (
            <div className="text-gray-500 text-sm">Select a file to view its contents</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtifactsView;
