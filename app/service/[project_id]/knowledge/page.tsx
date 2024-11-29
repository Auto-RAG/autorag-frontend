import { UploadDialog } from "@/components/upload/upload-dialog";

type PageProps = {
  params: Promise<{ project_id: string }>;
}

export default async function KnowledgePage({ params }: PageProps) {
  const { project_id } = await params;

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">Knowledge</h1>
      <UploadDialog projectId={project_id} />
    </div>
  );
}
