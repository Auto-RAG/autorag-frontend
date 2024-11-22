"use client";

import { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ConfigSelectorProps {
  onConfigSelect: (config: string) => void;
  onCustomSelect: () => void;
}

export function ConfigSelector({ onConfigSelect, onCustomSelect }: ConfigSelectorProps) {
  const [coverage, setCoverage] = useState<"compact" | "half" | "full">("compact");
  const [language, setLanguage] = useState<"english" | "korean">("english");
  const [gpuSetting, setGpuSetting] = useState<"only" | "none" | "full">("only");

  const handleSubmit = () => {
    // Here you would map the selections to the appropriate config YAML
    // This is a placeholder - you'll need to implement the actual config mapping
    const configKey = `${coverage}-${language}-${gpuSetting}`;
    const configYaml = getConfigForSelection(configKey);

    onConfigSelect(configYaml);
  };

  const getConfigForSelection = (key: string): string => {
    // This would contain your mapping logic for different combinations
    // Placeholder return
    return `# Configuration for ${key}\n# Add your YAML configuration here`;
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

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            Apply Configuration
          </Button>
          <Button type="button" className="flex-1" variant="outline" onClick={onCustomSelect}>
            Custom Configuration
          </Button>
        </div>
      </div>
    </form>
  );
}
