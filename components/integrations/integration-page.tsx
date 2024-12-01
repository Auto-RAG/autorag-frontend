"use client";

import { IntegrationDialog } from "@/components/integrations/integration-dialog";
import { integrations, integrationSetups } from "@/lib/integration-data";

export default function IntegrationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Integrations</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(integrations).map(([key, integration]) => (
            <div key={key}>
              <IntegrationDialog
                integration={integration}
                setup={integrationSetups[key]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
