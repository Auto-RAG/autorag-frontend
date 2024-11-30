"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

import { APIClient, CreateTrialRequest } from "@/lib/api-client";
import { TrialConfig } from "@/lib/api-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
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
import { ChunkOptionEnum, getChunkConfig, getParseConfig, ParseOptionEnum } from "@/lib/trial-creation-wizard";

interface WizardStep {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

export function CreateTrialDialog({
  projectId,
  disabled = false
}: {
  projectId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Add this function to generate default trial name
  const generateDefaultTrialName = () => {
    const now = new Date();

    return `Trial_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [trialName, setTrialName] = useState(generateDefaultTrialName());
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  // The each option states will be selected.
  const [parseOption, setParseOption] = useState(ParseOptionEnum.DEFAULT);
  const [chunkOption, setChunkOption] = useState(ChunkOptionEnum.DEFAULT);
  const [lang, setLang] = useState("en");

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
    },
    {
      title: "Run Optimization",
      description: "Run optimization",
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
    try {
      try {
        setIsProcessing(true);
        // Step 1: Parse
        console.log("Starting Parse step...");
        await updateStep(0, 'in-progress');

        const parseResponse = await apiClient.createParseTask(projectId, {
          name: `${trialName}`,
          extension: '*',
          config: getParseConfig(parseOption, "en")
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


        const chunkResponse = await apiClient.createChunkTask(projectId, {
          name: `${trialName}`,
          parsed_name: `${trialName}`,
          config: getChunkConfig(chunkOption, lang)
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

        const qaResponse = await apiClient.createQATask(projectId, {
          preset: "default",
          name: `${trialName}`,
          qa_num: 5,
          llm_config: {
            llm_name: "mock",
            llm_params: {}
          },
          lang: lang,
          chunked_name: `${trialName}`
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

      const key = 'compact-english-none';
      const trialConfigResponse = await fetch(`/api/sample/config/${key}`);
      const configContent = await trialConfigResponse.json();
      // Step 4: Create Trial
      const newTrialConfig: TrialConfig = {
        project_id: projectId,
        trial_id: trialName,
        corpus_name: trialName,
        qa_name: trialName,
        config: configContent.content
      }
      const newTrial: CreateTrialRequest = {
        name: trialName,
        config: newTrialConfig
      }

      const trialResponse = await apiClient.createTrial(projectId, newTrial);
      const trialId = trialResponse.id;

      if (!trialId) {
        toast.error('Failed to create trial');

        return;
      }

      // Step 5: Start the optimization



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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline">
          Create Trial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Trial</DialogTitle>
          <DialogDescription>
            Create a new trial to process and analyze documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Steps
            currentStep={currentStep}
            steps={steps}
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
                    required
                    id="trialName"
                    placeholder="Enter trial name"
                    value={trialName}
                    onChange={(e) => setTrialName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parseMethod">Parse Method</Label>
                  <Select
                    value={parseOption}
                    onValueChange={(value) => setParseOption(value as ParseOptionEnum)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parse method" />
                    </SelectTrigger>
                    <SelectContent>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={ParseOptionEnum.DEFAULT}>PDFMiner</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Extract text from PDF files, super cheap.</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={ParseOptionEnum.LLAMA_PARSE}>Llama Parse</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Use Llama Parse to extract text and images.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chunkMethod">Chunk Method</Label>
                  <Select
                    value={chunkOption}
                    onValueChange={(value) => setChunkOption(value as ChunkOptionEnum)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chunk method" />
                    </SelectTrigger>
                    <SelectContent>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={ChunkOptionEnum.DEFAULT}>Default</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>token-based. Almost free.</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={ChunkOptionEnum.SEMANTIC}>Semantic</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Use embedding model. It will take some time and little bit of dollar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={lang}
                    onValueChange={(value) => setLang(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    disabled={isProcessing}
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isProcessing}
                    type="submit"
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
