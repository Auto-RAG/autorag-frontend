"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table';
import { Eye, Trash2, PlayCircle, Plus } from 'lucide-react';

import { ChunkDialog } from './chunk-dialog';

import { APIClient } from '@/lib/api-client';

interface ChunkedDocument {
  id: string;
  name: string;
  module_name: string;
  module_params: string;
}

const ChunkedPage: React.FC<{ project_id: string }> = ({ project_id }) => {
  const [showChunkDialog, setShowChunkDialog] = useState(false);
  const [documents, setChunkedDocuments] = useState<ChunkedDocument[]>([]);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  useEffect(() => {
    const fetchChunkedDocuments = async () => {
      const res = await apiClient.getChunkedDocuments(project_id);
      const chunkedDocuments = res.map((doc) => ({
        id: doc.chunk_filepath,
        name: doc.chunk_name,
        module_name: doc.module_name,
        module_params: doc.module_params
      }));

      setChunkedDocuments(chunkedDocuments);
    };

    fetchChunkedDocuments();
  }, [project_id]);



  const handleDetails = (id: string) => {
    // Handle viewing details
    console.log('View details:', id);
  };

  const handleDelete = (id: string) => {
    // Handle deletion
    console.log('Delete:', id);
  };

  const handleUseInTrial = (id: string) => {
    // Handle using in trial
    console.log('Use in trial:', id);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Chunked Data</h1>
        <button 
          className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md"
          onClick={() => setShowChunkDialog(true)}
        >
          <Plus size={16} />
          New Chunk
        </button>
      </div>
      <ChunkDialog
        open={showChunkDialog}
        project_id={project_id}
        onOpenChange={setShowChunkDialog}
      />
      <div className="bg-white rounded-lg shadow">
        <Table aria-label="Chunked documents list">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>MODULE</TableColumn>
            <TableColumn>PARAMETERS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.module_name}</TableCell>
                <TableCell>{doc.module_params}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Details"
                      onClick={() => handleDetails(doc.id)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Use in Trial"
                      onClick={() => handleUseInTrial(doc.id)}
                    >
                      <PlayCircle size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChunkedPage;
