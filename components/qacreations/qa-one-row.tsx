"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Pagination from '../pagination';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { APIClient } from '@/lib/api-client';

interface QAOneRowProps {
  project_id: string;
  qa_name: string;
}


const QAOneRow: React.FC<QAOneRowProps> = ({ project_id, qa_name }) => {
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');
  const [question, setQuestion] = useState("question" || '');
  const [generationGT, setGenerationGT] = useState("generation_gt" || '');
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchQALength = async (project_id: string, qa_name: string) => {
      try {
        console.log("Fetching QA length...");
        const response = await apiClient.getQALength(project_id, qa_name);

        console.log(`Fetched total length: ${response.length}`);
        setTotalPage(response.length);
      } catch (error) {
        console.error("Error fetching QA length:", error);
      }
    };

    fetchQALength(project_id, qa_name);
  }, [project_id, qa_name]);


  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleGenerationGTChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGenerationGT(e.target.value);
  };

  const loadNewPage = (page_number: number,) => {
    const idx = page_number - 1;
    
  }

  return (
    <div className="qa-one-row">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4 w-full">
          <div className="flex-1">
            <Pagination totalPages={totalPage} onPageChange={() => {}} />
          </div>
          <div className="flex space-x-4">
            <Button
              className="bg-blue-500 text-white"
              onClick={() => { toast.error("Not Implemented.") }}
            >
              Save
            </Button>
            <Button
              className="bg-red-500 text-white"
              onClick={() => { toast.error("Delete functionality not implemented.") }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
        <div className="flex-1 w-full">
          <div className="question-section">
            <Label>Question</Label>
            <Textarea
              className="w-full"
              value={question}
              onChange={handleQuestionChange}
            />
          </div>

          <div className="retrieval-gt-section mt-4">
            <Label>Retrieval GT</Label>
            <div className="p-2 border rounded bg-gray-100">
              {"Havertz"}
            </div>
          </div>

          <div className="generation-gt-section mt-4">
            <Label>Generation GT</Label>
            <Textarea
              className="w-full"
              value={generationGT}
              onChange={handleGenerationGTChange}
            />
          </div>
        </div>
      </div>
  );
};

export default QAOneRow;
