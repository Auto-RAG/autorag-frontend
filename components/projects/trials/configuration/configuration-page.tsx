"use client";

import { useState } from "react";

import { ConfigSelector } from "./config-selector";
import { ConfigEditor } from "./config-editor";

import { Button } from "@/components/ui/button";


export function ConfigurationPage({
  project_id,
  trial_id
}: {
  project_id: string;
  trial_id: string;
}) {
    const [config, setConfig] = useState("");

    const handleConfigSelect = async (configYaml: string) => {
        setConfig(configYaml);
      };

      const handleConfigSave = async () => {
        // TODO: Implement config save logic using project_id and trial_id
        console.log("Config saved for project:", project_id, "trial:", trial_id);
      };
      
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Configuration</h2>
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white" 
          onClick={handleConfigSave}
        >
          Save Config
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border overflow-hidden">
          <ConfigSelector onConfigSelect={handleConfigSelect} />
        </div>
        <div className="border rounded-md overflow-hidden">
          <ConfigEditor value={config}/>
        </div>
      </div>
    </div>
  );
}
