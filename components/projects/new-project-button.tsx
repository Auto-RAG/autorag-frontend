"use client";

import { useState } from "react";

import { CreateProjectDialog } from "./create-project-dialog";

import { Button } from "@/components/ui/button";


export function NewProjectButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button variant="default" onClick={() => setIsDialogOpen(true)}>
        + New Project
      </Button>

      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onProjectCreated={() => {
          // Handle the newly created project here if needed
          setIsDialogOpen(false);
        }}
      />
    </>
  );
}
