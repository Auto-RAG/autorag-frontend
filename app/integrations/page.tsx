import { Metadata } from "next";

import IntegrationPage from "@/components/integrations/integration-page";

export const metadata: Metadata = {
  title: "Integrations | AutoRAG Cloud",
  description: "Manage your AutoRAG Cloud integrations",
};

export default function IntegrationsPage() {
  return (
    <IntegrationPage />
  );
}
