import { TrialDetail } from "@/components/projects/trial-detail-page";

export default async function TrialDetailPage({
  params
}: {
  params: Promise<{ project_id: string; trial_id: string }>;
}) {
  const { project_id, trial_id } = await params;
  
  return (
    <TrialDetail projectId={project_id} trialId={trial_id} />
  );
}
