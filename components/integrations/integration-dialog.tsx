"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { TagIcon } from "lucide-react";

import { IntegrationInfo, IntegrationSetup } from "@/lib/integration-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { APIClient } from "@/lib/api-client";

interface IntegrationDialogProps {
  integration: IntegrationInfo;
  setup: IntegrationSetup;
}

export function IntegrationDialog({ integration, setup }: IntegrationDialogProps) {
  const [open, setOpen] = useState(false);
  const [setupValues, setSetupValues] = useState(Object.fromEntries(setup.setups.map(s => [s.apiKey, ""])));
  const [isLoading, setIsLoading] = useState(false);
  const [registeredApiKeys, setRegisteredApiKeys] = useState<string[]>([]);
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const registerApiKey = async (apiKey: string, value: string) => {
    await apiClient.setEnv({ key: apiKey, value: value });
  }

  const getEnvList = async () => {
    const envList = await apiClient.getEnvList();

    setRegisteredApiKeys(Object.keys(envList));
  }

  useEffect(() => {
    getEnvList();
  }, []);

  const handleTest = async () => {
    try {
      setIsLoading(true);
      const result = await setup.onClickTest(setupValues);
      
      if (result.status === "success") {
        toast.success("Connection test successful!");
      } else {
        toast.error("Connection test failed: " + result.error);

        return;
      }

      setup.setups.forEach(setup => {
        registerApiKey(setup.apiKey, setupValues[setup.apiKey]);
      });

      setOpen(false);
    } catch (error) {
      toast.error("Connection test failed: " + error);
      setOpen(true);
    } finally {
      setIsLoading(false);
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
          <DialogDescription className="text-sm text-gray-500 mt-2">
            A red indicator means the key is not set, <br /> while green indicates the key is already configured.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {setup.setups.map((setup, index) => (
            <div key={index} className="grid gap-2">
              <Label htmlFor={setup.apiKey}>{setup.name}</Label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${registeredApiKeys.includes(setup.apiKey) ? 'bg-green-500' : 'bg-red-500'}`} />
                <Input
                  className="flex-1"
                  id={setup.apiKey}
                  placeholder={setup.description}
                  type="password"
                  onChange={(e) => {
                    setSetupValues({ ...setupValues, [setup.apiKey]: e.target.value });
                  }}
                />
              </div>
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
            disabled={isLoading || Object.values(setupValues).some(value => !value)}
            onClick={handleTest}
          >
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
