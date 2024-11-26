import { TrialSidebar } from '@/components/projects/trials/trial-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

type PageProps = {
  params: Promise<{ project_id: string; trial_id: string }>;
  children: React.ReactNode;
}

export default async function TrialLayout({ params, children }: PageProps) {
  const { project_id, trial_id } = await params;

  return (
    <div className="flex flex-col">
        <SidebarProvider>
          <TrialSidebar project_id={project_id} trial_id={trial_id} />
          <div className="flex-1 overflow-auto">
          <div className="h-full w-full p-6">{children}</div>
        </div>
        </SidebarProvider>
    </div>
  );
}
