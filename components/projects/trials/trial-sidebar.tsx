"use client"

import Link from 'next/link'
import { LayoutDashboard, FileText, ArrowLeft, Settings, MessageSquare } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

interface TrialSidebarProps {
  project_id: string,
  trial_id: string
}

export function TrialSidebar({ project_id, trial_id }: TrialSidebarProps) {
    return (
<Sidebar className="border-r">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${project_id}/trials`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Trial List
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${project_id}/trials/${trial_id}`}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Trial Overview
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${project_id}/trials/${trial_id}/configuration`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuration
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${project_id}/trials/${trial_id}/report`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Report
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${project_id}/trials/${trial_id}/chat`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
    );
}
