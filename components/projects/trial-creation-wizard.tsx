"use client";

import { useState, useEffect } from "react";
import { APIClient } from "@/lib/api-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Steps } from "@/components/ui/steps";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface TrialFormData {
  name: string;
  config?: {
    modules: Array<{
      module_type: string;
      parse_method: string[];
      jq_schema?: string;
      auto_detect?: boolean;
      glob_path?: string;
    }>;
  };
}

interface WizardStep {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

// Add this function at the top of the file
const getParserFromFilePath = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';

  const extensionToParser: { [key: string]: string } = {
    'pdf': 'pdfminer',
    'csv': 'csv',
    'md': 'unstructuredmarkdown',
    'markdown': 'unstructuredmarkdown',
    'html': 'bshtml',
    'htm': 'bshtml',
    'xml': 'unstructuredxml',
    'json': 'json',
    // '*': 'auto'  // Default for glob patterns
  };

  // // If the path contains a wildcard, return 'auto'
  // if (filePath.includes('*')) {
  //   return 'auto';
  // }

  return extensionToParser[extension]; // || 'auto';
};

export function CreateTrialDialog({
  isOpen,
  onOpenChange,
  projectId,
  onTrialCreated,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onTrialCreated: () => void;
}) {
  const router = useRouter();

  // Add this function to generate default trial name
  const generateDefaultTrialName = () => {
    const now = new Date();
    return `Trial_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState<TrialFormData>({
    name: generateDefaultTrialName(),
    config: {
      modules: [
        {
          module_type: "langchain_parse",
          parse_method: ["pdfminer"],
          auto_detect: false,
          glob_path: "./raw_data/*.pdf"
        }
      ]
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<WizardStep[]>([
    {
      title: "Parse Documents",
      description: "Extract text from documents",
      status: 'pending'
    },
    {
      title: "Chunk Content",
      description: "Split content into manageable chunks",
      status: 'pending'
    },
    {
      title: "Generate QA",
      description: "Create question-answer pairs",
      status: 'pending'
    }
  ]);

  const [pendingUpdate, setPendingUpdate] = useState<{
    stepIndex: number;
    status: WizardStep['status'];
    resolve: () => void;
  } | null>(null);

  // 실제 상태 업데이트를 확인하는 useEffect
  useEffect(() => {
    if (pendingUpdate &&
      currentStep === pendingUpdate.stepIndex &&
      steps[pendingUpdate.stepIndex].status === pendingUpdate.status) {
      console.log(`Step ${pendingUpdate.stepIndex} update confirmed:`);
      console.log(`- Current step: ${currentStep}`);
      console.log(`- Steps status: ${JSON.stringify(steps)}`);
      pendingUpdate.resolve();
      setPendingUpdate(null);
    }
  }, [currentStep, steps, pendingUpdate]);

  const updateStep = async (stepIndex: number, status: WizardStep['status']) => {
    console.log(`Updating step ${stepIndex} to ${status}`);

    return new Promise<void>((resolve) => {
      setPendingUpdate({ stepIndex, status, resolve });
      setCurrentStep(stepIndex);
      setSteps(prev => prev.map((step, idx) =>
        idx === stepIndex ? { ...step, status } : step
      ));
    });
  };

  // 상태 변화를 모니터링하는 useEffect 추가
  useEffect(() => {
    console.log(`[Effect] Current step changed to: ${currentStep}`);
  }, [currentStep]);

  useEffect(() => {
    console.log(`[Effect] Steps updated:`, steps);
  }, [steps]);

  const handleCreateTrial = async () => {
    let trialId = '';

    try {
      try {
        setIsProcessing(true);

        // Step 1: Create Trial
        const trialResponse = await apiClient.createTrial(projectId, {
          name: formData.name
        });
        trialId = trialResponse.id;

        // Step 2: Parse
        console.log("Starting Parse step...");
        await updateStep(0, 'in-progress');

        console.log(`formData.config?.modules[0].glob_path: ${formData.config?.modules[0].glob_path}`);
        const parseResponse = await apiClient.createParseTask(projectId, trialId, {
          name: `parse_${trialId}`,
          path: formData.config?.modules[0].glob_path || '',
          config: {
            modules: [{
              module_type: "langchain_parse",
              parse_method: [getParserFromFilePath(formData.config?.modules[0].glob_path || 'csv')]
            }]
          }
        });
        toast.success('Parse task created successfully');
        console.log(`parseResponse: ${JSON.stringify(parseResponse)}`);
        // 에러 응답 처리
        if (parseResponse.status !== 'started') {
          toast.error(parseResponse.data);
          await updateStep(0, 'error');
          return;
        }
        console.log(`parseResponse.task_id: ${parseResponse.task_id}`);
        await waitForTask(projectId, parseResponse.task_id);

        await updateStep(0, 'completed');
        console.log("Parse step completed");
      } catch (error) {

        console.error('Error in parse step:', error);
        toast.error(`Error in parse step: ${error}`);
        await updateStep(0, 'error');  // Parse 단계 에러
        throw error;
      }

      try {
        // Step 3: Chunk
        console.log("Starting Chunk step...");
        await updateStep(1, 'in-progress');


        const chunkResponse = await apiClient.createChunkTask(projectId, trialId, {
          name: `chunk_${trialId}`,
          config: {
            modules: [{
              module_type: "llama_index_chunk",
              chunk_method: ["Token"],
              chunk_size: 512,
              chunk_overlap: 50
            }]
          }
        });

        await waitForTask(projectId, chunkResponse.task_id);
        await updateStep(1, 'completed');
        console.log("Chunk step completed");

      } catch (error) {
        console.error('Error in chunk step:', error);
        toast.error(`Error in chunk step: ${error}`);
        await updateStep(1, 'error');  // Chunk 단계 에러
        throw error;
      }


      try {
        // Step 3: QA
        console.log("Starting QA step...");
        await updateStep(2, 'in-progress');

        const qaResponse = await apiClient.createQATask(projectId, trialId, {
          preset: "simple",
          name: `qa_${trialId}`,
          qa_num: 5,
          llm_config: {
            llm_name: "mock"
          },
          lang: "ko"
        });

        await waitForTask(projectId, qaResponse.task_id);
        await updateStep(2, 'completed');
        console.log("QA step completed");

      } catch (error) {
        console.error('Error in QA step:', error);
        toast.error(`Error in QA step: ${error}`);
        await updateStep(2, 'error');
        throw error;
      }


      // Trial detail 페이지로 이동
      router.push(`/projects/${projectId}/trials/${trialId}`);


    } catch (error: any) {
      console.error('Error in trial creation process:', error);
      // 전체 프로세스 에러는 여기서 처리
    } finally {
      setIsProcessing(false);
    }
  };

  const waitForTask = async (projectId: string, taskId: string) => {
    const maxAttempts = 60;  // 최대 시도 횟수 (5분)
    const delayMs = 5000;    // 5초마다 확인

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await apiClient.getTask(projectId, taskId);
      console.log(`response: ${JSON.stringify(response)}`);
      if (response.status === 'SUCCESS') {
        return response;
      }

      if (response.status === 'FAILURE' ) {
        throw new Error(`Task failed: ${response.error || 'Unknown error'}`);
      }

      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    throw new Error('Task timed out');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Trial</DialogTitle>
          <DialogDescription>
            Create a new trial to process and analyze documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Steps
            steps={steps}
            currentStep={currentStep}
          />

          <Card className="p-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateTrial();
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trialName">Trial Name</Label>
                  <Input
                    id="trialName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter trial name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filePath">Document Path</Label>
                  <Input
                    id="filePath"
                    value={formData.config?.modules[0].glob_path || './raw_data/*.*'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      config: {
                        modules: [{
                          ...prev.config!.modules[0],
                          glob_path: e.target.value
                        }]
                      }
                    }))}
                    placeholder="./raw_data/*.*"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Default path: ./raw_data/*.*
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parseMethod">Parse Method</Label>
                  <Select
                    value={formData.config?.modules[0].auto_detect ? "csv" : formData.config?.modules[0].parse_method[0]}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      config: {
                        modules: [
                          {
                            ...prev.config!.modules[0],
                            parse_method: value === "auto" ? ["auto"] : [value],
                            auto_detect: value === "auto",
                            ...(value !== "json" && { jq_schema: undefined })
                          }
                        ]
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parse method" />
                    </SelectTrigger>
                    <SelectContent>
                      <TooltipProvider>
                        {/* <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value="auto">Auto Detect</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Automatically detect appropriate parser based on file type</p>
                          </TooltipContent>
                        </Tooltip> */}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value="pdfminer">PDFMiner</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Extract text content from PDF files</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value="csv">CSV</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Parse CSV (Comma-Separated Values) files</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value="unstructuredmarkdown">Markdown</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Parse Markdown formatted text files</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value="bshtml">HTML</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Extract content from HTML documents using BeautifulSoup</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value="unstructuredxml">XML</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Parse XML documents and extract structured content</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value="json">JSON</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Parse JSON files using JQ schema for content extraction</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SelectContent>
                  </Select>
                </div>

                {formData.config?.modules[0].parse_method[0] === "json" && (
                  <div className="space-y-2">
                    <Label htmlFor="jqSchema">JQ Schema</Label>
                    <Input
                      id="jqSchema"
                      value={formData.config?.modules[0].jq_schema}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        config: {
                          modules: [
                            {
                              ...prev.config!.modules[0],
                              jq_schema: e.target.value
                            }
                          ]
                        }
                      }))}
                      placeholder="Enter JQ schema (e.g., .messages[].content)"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Create Trial'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </DialogContent>
      <Toaster />

    </Dialog>
  );
}
