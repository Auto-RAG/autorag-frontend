"use client";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectConfigProps {
  projectId: string;
}

export function ProjectConfig({ projectId }: ProjectConfigProps) {
  const [configYaml, setConfigYaml] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Editor
            defaultLanguage="yaml"
            height="60vh"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              rulers: [80],
              wordWrap: "on",
            }}
            value={configYaml}
            onChange={(value) => setConfigYaml(value || "")}
          />
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Reset</Button>
            <Button>Save Configuration</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
