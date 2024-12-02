"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
