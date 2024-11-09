import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@nextui-org/button";
import {
  FileText,
  Scissors,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Document Parsing",
    description: "Configure document parsing settings and select files",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Text Chunking",
    description: "Set up text chunking parameters",
    icon: <Scissors className="h-5 w-5" />,
  },
  {
    title: "QA Generation",
    description: "Configure QA generation settings",
    icon: <MessageSquare className="h-5 w-5" />,
  },
];

export function CreateTrialDialog({
  isOpen,
  onOpenChange,
  projectId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    parsing: {
      glob_path: "",
      name: "",
      config: {},
    },
    chunking: {
      trial_id: "",
      name: "",
      config: {},
    },
    qa: {
      trial_id: "",
      name: "",
      qa_num: 5,
      preset: "basic" as "basic" | "simple" | "advanced",
      llm_config: {
        llm_name: "",
        llm_params: {},
      },
    },
  });

  const handleNext = async () => {
    if (currentStep === STEPS.length - 1) {
      // Final step - create trial
      try {
        // 1. Start parsing
        const parseResponse = await fetch(
          `/api/projects/${projectId}/preparation/parse`,
          {
            method: "POST",
            body: JSON.stringify(formData.parsing),
          },
        );
        const parseData = await parseResponse.json();

        // 2. Start chunking with parse trial ID
        const chunkResponse = await fetch(
          `/api/projects/${projectId}/preparation/chunk`,
          {
            method: "POST",
            body: JSON.stringify({
              ...formData.chunking,
              trial_id: parseData.trial_id,
            }),
          },
        );
        const chunkData = await chunkResponse.json();

        // 3. Start QA generation with chunk trial ID
        await fetch(`/api/projects/${projectId}/preparation/qa`, {
          method: "POST",
          body: JSON.stringify({
            ...formData.qa,
            trial_id: chunkData.trial_id,
          }),
        });

        onOpenChange(false);
      } catch (error) {
        console.error("Error creating trial:", error);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="globPath"
              >
                Document Path Pattern
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                id="globPath"
                placeholder="e.g., /data/docs/**/*.pdf"
                type="text"
                value={formData.parsing.glob_path}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parsing: { ...prev.parsing, glob_path: e.target.value },
                  }))
                }
              />
            </div>

            {/* Add more parsing configuration options */}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="chunkSize"
              >
                Chunk Size
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                id="chunkSize"
                placeholder="Enter chunk size"
                type="number"
                value={formData.chunking.config.toString() || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    chunking: {
                      ...prev.chunking,
                      config: {
                        ...prev.chunking.config,
                        chunk_size: parseInt(e.target.value),
                      },
                    },
                  }))
                }
              />
            </div>

            {/* Add more chunking configuration options */}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="qaNum">
                Number of QA Pairs
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                id="qaNum"
                placeholder="Enter number of QA pairs"
                type="number"
                value={formData.qa.qa_num}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    qa: { ...prev.qa, qa_num: parseInt(e.target.value) },
                  }))
                }
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="preset"
              >
                Preset
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                id="preset"
                value={formData.qa.preset}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    qa: {
                      ...prev.qa,
                      preset: e.target.value as "basic" | "simple" | "advanced",
                    },
                  }))
                }
              >
                <option value="basic">Basic</option>
                <option value="simple">Simple</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="llmName"
              >
                LLM Name
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                id="llmName"
                placeholder="Enter LLM name"
                type="text"
                value={formData.qa.llm_config.llm_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    qa: {
                      ...prev.qa,
                      llm_config: {
                        ...prev.qa.llm_config,
                        llm_name: e.target.value,
                      },
                    },
                  }))
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto">
          {/* Steps indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center w-1/3 ${
                    index === currentStep
                      ? "text-primary"
                      : index < currentStep
                        ? "text-gray-500"
                        : "text-gray-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                      index === currentStep
                        ? "border-primary bg-primary/10"
                        : index < currentStep
                          ? "border-gray-500 bg-gray-100"
                          : "border-gray-300"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <Dialog.Title className="text-xl font-semibold mb-4">
            {STEPS[currentStep].title}
          </Dialog.Title>
          <Dialog.Description className="text-gray-500 dark:text-gray-400 mb-6">
            {STEPS[currentStep].description}
          </Dialog.Description>

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              color="default"
              disabled={currentStep === 0}
              startContent={<ChevronLeft size={16} />}
              variant="flat"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              color="primary"
              endContent={
                currentStep === STEPS.length - 1 ? undefined : (
                  <ChevronRight size={16} />
                )
              }
              onClick={handleNext}
            >
              {currentStep === STEPS.length - 1 ? "Create Trial" : "Next"}
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Cross2Icon className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
