"use client";

import { IntegrationDialog } from "@/components/integrations/integration-dialog";
import { integrations, integrationSetups } from "@/lib/integration-data";

export default function IntegrationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Integrations</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <IntegrationDialog 
              integration={integrations["openai"]} 
              setup={integrationSetups["openai"]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
