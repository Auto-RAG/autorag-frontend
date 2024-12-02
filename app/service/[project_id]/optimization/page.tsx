import { CreateTrialDialog } from "@/components/projects/trial-creation-wizard";
import { TrialsList } from "@/components/projects/trials-list";

type PageProps = {
  params: Promise<{ project_id: string }>;
}

export default async function OptimizationPage({ params }: PageProps) {
  const { project_id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Optimization</h1>
          <p className="text-sm text-muted-foreground">Quickly make an optimized RAG</p>
        </div>
        <CreateTrialDialog disabled={false} projectId={project_id} />
      </div>
      <TrialsList isTrial={false} projectId={project_id} />
    </div>
  );
}
