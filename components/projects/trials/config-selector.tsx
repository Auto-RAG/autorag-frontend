"use client";


import { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { XCircle } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { APIClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfigSelectorProps {
  onConfigSelect: (config: string) => void;
}

interface Config{
    config: Object;
    config_string: string;
}

export function EnvChecker({ envVariables }: { envVariables: { key: string; value?: string }[] }) {
  return (
  <div className="w-full">
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Environment Variables Status</CardTitle>
            <CardDescription>Required environment variables for optimization</CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline" 
            onClick={() => window.location.href = '/settings'}
          >
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {envVariables?.length === 0 ? (
          <div className="text-sm text-gray-500">No need to configure environment variables</div>
        ) : (
          envVariables.map((env) => (
            <div 
              key={env.key} 
              className={cn(
                "rounded-lg border p-4",
                env.value ? "border-gray-200 bg-white" : "border-red-200 bg-red-50"
              )}
            >
              <div className="flex items-center gap-2">
                {env.value ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="font-mono">{env.key}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  </div>
  );
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
                value={option.value}
                id={option.value}
                className={cn(
                  "peer relative w-full rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                )}
              >
                <Label
                  htmlFor={option.value}
                  className="flex items-center justify-between"
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
                value={option.value}
                id={option.value}
                className={cn(
                  "peer relative w-full rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                )}
              >
                <Label
                  htmlFor={option.value}
                  className="flex items-center justify-between"
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
                value={option.value}
                id={option.value}
                className={cn(
                  "peer relative w-full rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                )}
              >
                <Label
                  htmlFor={option.value}
                  className="flex items-center justify-between"
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
