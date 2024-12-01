import ArtifactsView from "@/components/artifacts/artifacts-view-library";
import { UploadDialog } from "@/components/upload/upload-dialog";

type PageProps = {
  params: Promise<{ project_id: string }>;
}

export default async function KnowledgePage({ params }: PageProps) {
  const { project_id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Knowledge</h1>
        <UploadDialog projectId={project_id} />
      </div>
      <ArtifactsView projectId={project_id} />
    </div>
  );
}
