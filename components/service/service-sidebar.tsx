"use client";

import { useRouter } from "next/navigation";
import { BookOpen, GitBranch, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { Separator } from "@/components/ui/separator";

interface ServiceSidebarProps {
  project_id: string
}

export function ServiceSidebar({ project_id }: ServiceSidebarProps) {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(`/service/${project_id}/${path}`);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/service')}>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <h2 className="px-4 text-lg font-semibold tracking-tight">
          {project_id}
        </h2>
        <Separator className="my-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation('knowledge')}>
              <BookOpen className="mr-2 h-4 w-4" />
              Knowledge
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation('optimization')}>
              <GitBranch className="mr-2 h-4 w-4" />
              Optimization
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
