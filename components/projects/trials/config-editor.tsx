"use client";

import { Editor as MonacoEditor } from "@monaco-editor/react";
import { PencilIcon, SaveIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ConfigEditor({ value, readOnly = true }: { value: string; readOnly?: boolean }) {
  const [isReadOnly, setIsReadOnly] = useState(readOnly);

  const handleToggleEdit = () => {
    setIsReadOnly(false);
  };

  const handleSave = () => {
    setIsReadOnly(true);
  };

  return (
    <div className="relative h-[600px]">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {isReadOnly ? (
          <Button
            className="h-8 w-8"
            size="icon"
            variant="ghost"
            onClick={handleToggleEdit}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            className="h-8"
            size="sm"
            variant="ghost"
            onClick={handleSave}
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
      </div>
      <MonacoEditor
        defaultLanguage="yaml"
        height="100%"
        options={{
          minimap: { enabled: false },
          readOnly: isReadOnly,
        }}
        value={value}
      />
    </div>
  );
}
