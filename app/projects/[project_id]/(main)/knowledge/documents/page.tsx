import { DocumentPage } from "@/components/projects/document-page";

type PageProps = {
    params: Promise<{ project_id: string }>;
  }

export default async function DocumentsPage({ params }: PageProps) {
    const {project_id} = await params;

    return <DocumentPage projectId={project_id} />;
}
