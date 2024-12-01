import { ServiceSidebar } from "@/components/service/service-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface ServiceLayoutProps {
  children: React.ReactNode;
  params: {
    project_id: string;
  };
}

export default async function ServiceLayout({ children, params }: ServiceLayoutProps) {
    const { project_id } = await params;

  return (
    <SidebarProvider>
        <ServiceSidebar project_id={project_id} />
        <div className="flex-1 overflow-auto">
          <div className="h-full w-full p-6">{children}</div>
        </div>
    </SidebarProvider>
   
  );
}
