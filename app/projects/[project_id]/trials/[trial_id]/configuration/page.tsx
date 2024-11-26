import { ConfigurationPage } from "@/components/projects/trials/configuration/configuration-page";

interface PageProps {
  params: {
    project_id: string;
    trial_id: string;
  }
}

async function getParams(params: PageProps['params']) {
  return {
    project_id: params.project_id,
    trial_id: params.trial_id
  };
}

export default async function TrialConfigurationPage({ params }: PageProps) {
  const { project_id, trial_id } = await getParams(params);

  return (
    <div className="container mx-auto">
      <ConfigurationPage project_id={project_id} trial_id={trial_id} />
    </div>
  );
}
