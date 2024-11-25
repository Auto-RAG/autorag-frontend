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

  // return (
  //   <div className="flex h-screen">
  //     {/* Sidebar */}
  //     <div className="w-64 bg-gray-100 border-r">
  //       <div className="p-1">
  //         <h2 className="text-xl font-semibold mb-4">Project Navigation</h2>
  //         <nav className="space-y-2">
  //           <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded" 
  //                 href={`/projects/${project_id}`}>
  //             Overview
  //           </Link>
  //           <div>
  //             <div className="block px-4 py-2 text-gray-700">
  //               Knowledge
  //             </div>
  //             <div className="ml-4">
  //               <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded" 
  //                     href={`/projects/${project_id}/knowledge/documents`}>
  //                 Documents
  //               </Link>
  //               <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded" 
  //                     href={`/projects/${project_id}/knowledge/parsed`}>
  //                 Parsed
  //               </Link>
  //               <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded" 
  //                     href={`/projects/${project_id}/knowledge/chunked`}>
  //                 Chunked
  //               </Link>
  //             </div>
  //           </div>
  //           <div>
  //             <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded" 
  //                   href={`/projects/${project_id}/qa`}>
  //               QA
  //             </Link>
  //             <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded" 
  //                   href={`/projects/${project_id}/trials`}>
  //               Trials
  //             </Link>
  //           </div>
            
  //         </nav>
  //       </div>
  //     </div>

  //     {/* Main Content */}
  //     <div className="flex-1 overflow-auto">
  //       <div className="p-6">
  //         {children}
  //       </div>
  //     </div>
  //   </div>
  // );
}
