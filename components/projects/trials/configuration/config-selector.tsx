"use client";


import { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

import { EnvChecker } from "./env-checker";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { APIClient } from "@/lib/api-client";

interface ConfigSelectorProps {
  onConfigSelect: (config: string) => void;
}

interface Config{
    config: Object;
    config_string: string;
}

export function ConfigSelector({ onConfigSelect }: ConfigSelectorProps) {
  const [coverage, setCoverage] = useState<"compact" | "half" | "full">("compact");
  const [language, setLanguage] = useState<"english" | "korean">("english");
  const [gpuSetting, setGpuSetting] = useState<"only" | "none" | "full">("only");
  const [targetEnvVariables, setTargetEnvVariables] = useState<{ key: string; value?: string }[]>([]);

  const handleSubmit = async () => {
    // Here you would map the selections to the appropriate config YAML
    // This is a placeholder - you'll need to implement the actual config mapping
    const configKey = `${coverage}-${language}-${gpuSetting}`;
    const configYaml = await getConfigForSelection(configKey);

    onConfigSelect(configYaml.config_string);
  };

  const getConfigForSelection = async (key: string): Promise<Config> => {
      try {
        const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');
        const response = await fetch(`/api/sample/config/${key}`);
        const configContent = await response.json();

        // Get target env keys and retrieve the env keys from the API server.
        const targetEnvKeys = configContent.target_env_keys;
        const envVariables: Record<string, string> = await apiClient.getEnvList();

        setTargetEnvVariables(targetEnvKeys.map((key: string) => ({ key: key, value: envVariables[key] })));

        return { config: configContent.content, config_string: configContent.raw_content };
      } catch (error) {
        console.error('Error loading config:', error);

        return { config: '# Error loading configuration file', config_string: '# Error loading configuration file' };
      }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-medium p-4">Coverage Type</Label>
          <RadioGroup.Root
            className="grid grid-cols-3 gap-4 mt-2 p-4"
            value={coverage}
            onValueChange={(value) => setCoverage(value as typeof coverage)}
          >
            {[
              { value: "compact", label: "Compact" },
              { value: "half", label: "Half" },
              { value: "full", label: "Full" }
            ].map((option) => (
              <RadioGroup.Item
                key={option.value}
                className={cn(
                  "peer relative w-full rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                )}
                id={option.value}
                value={option.value}
              >
                <Label
                  className="flex items-center justify-between"
                  htmlFor={option.value}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                      <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>{option.label}</span>
                  </div>
                </Label>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium p-4">Language</Label>
          <RadioGroup.Root
            className="grid grid-cols-2 gap-4 mt-2 p-4"
            value={language}
            onValueChange={(value) => setLanguage(value as typeof language)}
          >
            {[
              { value: "en", label: "English" },
              { value: "ko", label: "Korean" }
            ].map((option) => (
              <RadioGroup.Item
                key={option.value}
                className={cn(
                  "peer relative w-full rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                )}
                id={option.value}
                value={option.value}
              >
                <Label
                  className="flex items-center justify-between"
                  htmlFor={option.value}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                      <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>{option.label}</span>
                  </div>
                </Label>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium p-4">GPU Settings</Label>
          <RadioGroup.Root
            className="grid grid-cols-3 gap-4 mt-2 p-4"
            value={gpuSetting}
            onValueChange={(value) => setGpuSetting(value as typeof gpuSetting)}
          >
            {[
              { value: "only_gpu", label: "Only GPU" },
              { value: "only_api", label: "No GPU" },
              { value: "all", label: "Full" }
            ].map((option) => (
              <RadioGroup.Item
                key={option.value}
                className={cn(
                  "peer relative w-full rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                )}
                id={option.value}
                value={option.value}
              >
                <Label
                  className="flex items-center justify-between"
                  htmlFor={option.value}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                      <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>{option.label}</span>
                  </div>
                </Label>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </div>

        <div className="flex space-x-4 p-4">
          <Button className="flex-1" type="submit">
            Apply Configuration
          </Button>
        </div>
      </div>
      <div className="border-t border-gray-200 my-3" />
      <div className="flex space-x-4 p-2">
        <EnvChecker envVariables={targetEnvVariables} />
      </div>
    </form>
  );
}
