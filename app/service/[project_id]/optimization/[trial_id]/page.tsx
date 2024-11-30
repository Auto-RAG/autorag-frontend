import OptimizationPage from "@/components/service/optimization/optimization-page";

type PageProps = {
  params: Promise<{ 
    project_id: string;
    trial_id: string;
  }>;
}

export default async function OptimizationDetailPage({ params }: PageProps) {
  const { project_id, trial_id } = await params;

  return (
    <OptimizationPage projectId={project_id} trialId={trial_id} />
  );
}
