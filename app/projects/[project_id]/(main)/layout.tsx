import { ProjectSidebar } from '@/components/projects/project-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

type PageProps = {
    params: Promise<{ project_id: string }>;
    children: React.ReactNode;
  }

export default async function ProjectLayout({ params, children }: PageProps) {
  const { project_id } = await params;

  return (
    <SidebarProvider>
        <ProjectSidebar projectId={project_id} />
        <div className="flex-1 overflow-auto">
          <div className="h-full w-full p-6">{children}</div>
        </div>
    </SidebarProvider>
  )
}
