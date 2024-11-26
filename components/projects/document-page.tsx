"use client";

import { useState } from "react";
import { FileText, BarChart2 } from "lucide-react";

import ArtifactsView from "../artifacts/artifacts-view-library";

import { UploadFiles } from "./upload-files";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function DocumentPage({ projectId }: { projectId: string }) {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger className="flex items-center gap-2" value="upload">
          <FileText className="h-4 w-4" />
          Upload Files
        </TabsTrigger>
        <TabsTrigger className="flex items-center gap-2" value="artifacts">
          <BarChart2 className="h-4 w-4" />
          Documents
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadFiles 
              filesUploadedCallback={() => {
                setActiveTab("artifacts");
              }} 
              projectId={projectId} 
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="artifacts">
        <Card>
          <CardHeader>
            <CardTitle>Artifacts(RAW_DATA)</CardTitle>
          </CardHeader>
          <CardContent>
            <ArtifactsView projectId={projectId} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
