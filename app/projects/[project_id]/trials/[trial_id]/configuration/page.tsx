import { ConfigurationPage } from "@/components/projects/trials/configuration/configuration-page";

export default async function TrialConfigurationPage({ params }: {params: Promise<{ project_id: string; trial_id: string }>;}) 
{
  const { project_id, trial_id } = await params;

  return (
    <div className="container mx-auto">
      <ConfigurationPage project_id={project_id} trial_id={trial_id} />
    </div>
  );
}
