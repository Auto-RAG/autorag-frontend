"use client";

import { Editor as MonacoEditor } from "@monaco-editor/react";
// In MVP, ConfigEditor is read-only.
export function ConfigEditor({ value,readOnly = true }: { value: string, readOnly?: boolean }) {
  return (
    <div className="relative h-[600px]">
      <MonacoEditor
        defaultLanguage="yaml"
        height="100%"
        options={{
          minimap: { enabled: false },
          readOnly: readOnly,
        }}
        value={value}
      />
    </div>
  );
}
