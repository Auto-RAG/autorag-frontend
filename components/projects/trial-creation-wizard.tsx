"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

import RectangleRadioGroup from "../rectangle-radio-group";

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
  const [presetOption, setPresetOption] = useState("");
  const [lang, setLang] = useState("en");
  const [speedFirst, setSpeedFirst] = useState(false);
  const [trialId, setTrialId] = useState("");
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
      title: "Initialize Optimization",
      description: "Initialize optimization process",
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

  useEffect(() => {
    console.log(`[Effect] Speed first changed to: ${speedFirst}`);
  }, [speedFirst]);

  useEffect(() => {
    console.log(`[Effect] Trial ID changed to: ${trialId}`);
  }, [trialId]);

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
          config: getParseConfig(presetOption as ParseOptionEnum, "en")
        });

        // 에러 응답 처리
        if (parseResponse.status !== 'started') {
          toast.error(parseResponse.data);
          await updateStep(0, 'error');

          return;
        }
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
          config: getChunkConfig(presetOption as ChunkOptionEnum, lang)
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
          preset: presetOption === 'cheap' ? 'simple' : presetOption === 'expensive' ? 'advanced' : '',
          name: `${trialName}`,
          qa_num: presetOption === 'cheap' ? 70 : presetOption === 'expensive' ? 100 : 10,
          llm_config: {
            llm_name: "openai",
            llm_params: {model: presetOption === 'cheap' ? "gpt-4o-mini" : presetOption === 'expensive' ? "gpt-4o" : "gpt-4o-mini"} 
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

      const key = `${presetOption === 'cheap' ? 'cheap' : 'expensive'}-${speedFirst ? 'speed' : 'answer'}-${lang}`;
      const trialConfigResponse = await fetch(`/api/sample/config/${key}`);
      const configContent = await trialConfigResponse.json();

      let newTrialId = "";

      // Step 4: Initialize Optimization
      try {
        console.log("Starting trial creation...");
        await updateStep(3, 'in-progress');

        const newTrialConfig: TrialConfig = {
          project_id: projectId,
          corpus_name: trialName,
          qa_name: trialName,
          config: configContent.content
        }
        const newTrial: CreateTrialRequest = {
          name: trialName,
          config: newTrialConfig
        }

        const trialResponse = await apiClient.createTrial(projectId, newTrial);

        newTrialId = trialResponse.id;
        setTrialId(trialResponse.id);

        await updateStep(3, 'completed');
        console.log("Trial creation completed");

      } catch (error) {
        console.error('Error in trial creation:', error);
        toast.error(`Error in trial creation: ${error}`);
        await updateStep(3, 'error');
        throw error;
      }

      // Step 5: Run Optimization
      try {
        console.log("Starting run optimization...");
        await updateStep(4, 'in-progress');

        const evaluateResponse = await apiClient.evaluateTrial(projectId, newTrialId);
        const evaluateTaskId = evaluateResponse.task_id;

        await waitForTask(projectId, evaluateTaskId);
        await updateStep(4, 'completed');
        console.log("Run optimization completed");
      } catch (error) {
        console.error('Error in run optimization:', error);
        toast.error(`Error in run optimization: ${error}`);
        await updateStep(4, 'error');
        throw error;
      }

      setOpen(false);
      // Route to the trial detail page
      router.push(`/service/${projectId}/optimization/${newTrialId}`);

    } catch (error: any) {
      console.error('Error in trial creation process:', error);
      // 전체 프로세스 에러는 여기서 처리
    } finally {
      setIsProcessing(false);
    }
  };

  const waitForTask = async (projectId: string, taskId: string) => {
    const maxAttempts = 720;  // 최대 시도 횟수 (1시간)
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
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Trial</DialogTitle>
          <DialogDescription>
            Create a new trial to process and analyze documents.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6">
        <div className="w-[350px]">
            <Steps
              currentStep={currentStep}
              steps={steps}
            />
          </div>
          {/* <EnvChecker envVariables={targetEnvVariables}/> */}
          <Card className="p-6 w-[350px]">
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
                  <RectangleRadioGroup
                    label="Preset"
                    options={[
                      { value: "cheap", label: "Cheap" },
                      { value: "expensive", label: "Expensive" }
                    ]}
                    onValueChange={(value) => setPresetOption(value)}
                  />
                </div>
                <div className="space-y-2">
                  <RectangleRadioGroup
                    label="Language"
                    options={[
                      { value: "en", label: "English" },
                      { value: "ko", label: "Korean" }
                    ]}
                    onValueChange={(value) => setLang(value)}
                  />
                </div>
                <div className="space-y-2"> 
                  <RectangleRadioGroup
                    label="Priority"
                    options={[
                      { value: "quality", label: "Answer Quality"},
                      { value: "speed", label: "Speed"}
                    ]}
                      onValueChange={(value) => setSpeedFirst(value === "speed")}
                  />
                </div>
              </div>
            </form>
          </Card> 
        </div>

        <div className="flex justify-center space-x-2 mt-6">
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
            onClick={handleCreateTrial}
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
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}
