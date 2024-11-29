"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { TagIcon } from "lucide-react";

import { IntegrationInfo, IntegrationSetup } from "@/lib/integration-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface IntegrationDialogProps {
  integration: IntegrationInfo;
  setup: IntegrationSetup;
}

export function IntegrationDialog({ integration, setup }: IntegrationDialogProps) {
  const [open, setOpen] = useState(false);
  const [setupValues, setSetupValues] = useState(setup.setups.map(s => ({ ...s, value: "" })));
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    try {
      setIsLoading(true);
      const result = await setup.onClickTest(setup.setups);
      
      if (result.status === "success") {
        toast.success("Connection test successful!");
      } else {
        toast.error("Connection test failed: " + result.error);
      }
    } catch (error) {
      toast.error("Connection test failed: " + error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="w-full h-48 hover:bg-accent cursor-pointer transition-colors relative">
          <CardContent className="pt-6">
            <div className="flex flex-col w-full h-full">
              <div className="flex items-center space-x-2">
                <Image
                  alt={integration.name}
                  className="rounded"
                  height={24}
                  src={integration.imagePath}
                  width={24}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{integration.name}</span>
                  <span className="text-sm text-gray-500">by {integration.author}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{integration.description}</p>
              <div className="absolute bottom-4 left-6">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                  <TagIcon className="w-3 h-3" />
                  {integration.tag}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{integration.name} Integration Setup</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {setup.setups.map((setup, index) => (
            <div key={index} className="grid gap-2">
              <Label htmlFor={setup.apiKey}>{setup.name}</Label>
              <Input
                id={setup.apiKey}
                placeholder={setup.description}
                type="password"
                onChange={(e) => {
                  const newSetupValues = [...setupValues];

                  newSetupValues[index].value = e.target.value;
                  setSetupValues(newSetupValues);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading || setupValues.some(s => !s.value)}
            onClick={handleTest}
          >
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
