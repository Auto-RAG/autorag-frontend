"use client";

import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table';
import { Eye, Trash2, PlayCircle, Plus } from 'lucide-react';

interface ChunkedDocument {
  id: string;
  name: string;
  chunked_at: string;
  method: string;
}

const ChunkedPage: React.FC = () => {
  const [documents] = useState<ChunkedDocument[]>([
    {
      id: '1',
      name: 'Lab Report Analysis',
      chunked_at: '2024-03-15T10:30:00Z',
      method: 'Sliding Window'
    },
    {
      id: '2', 
      name: 'Medical Research Paper',
      chunked_at: '2024-03-15T11:45:00Z',
      method: 'Paragraph'
    }
  ]);

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
        <button className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md">
          <Plus size={16} />
          New Chunk
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <Table aria-label="Chunked documents list">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>CHUNKED AT</TableColumn>
            <TableColumn>METHOD</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{new Date(doc.chunked_at).toLocaleString()}</TableCell>
                <TableCell>{doc.method}</TableCell>
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
