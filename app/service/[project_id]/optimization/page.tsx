import { CreateTrialDialog } from "@/components/projects/trial-creation-wizard";
import { TrialsList } from "@/components/projects/trials-list";

type PageProps = {
  params: Promise<{ project_id: string }>;
}

export default async function VersionPage({ params }: PageProps) {
  const { project_id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Version</h1>
        <CreateTrialDialog projectId={project_id} />
      </div>
      <TrialsList isTrial={false} projectId={project_id} />
    </div>
  );
}
