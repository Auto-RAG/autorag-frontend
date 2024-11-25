import { ProjectDetail } from "@/components/projects/project-detail";

type PageProps = {
  params: Promise<{ project_id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { project_id } = await params;

  return <ProjectDetail projectId={project_id} />;
}
