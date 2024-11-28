"use client"

import Link from 'next/link'
import { LayoutDashboard, FileText, Database, Blocks, MessageSquare, FlaskConical, Home, UserPlus, ChevronDown } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroup
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectSidebarProps {
  projectId: string
}

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Database className="mr-2 h-4 w-4" />
                  <span>{projectId}</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem asChild>
                  <Link href="/projects">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Collaborator
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`/projects/${projectId}`}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Knowledge
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/projects/${projectId}/knowledge/documents`}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Documents</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/projects/${projectId}/knowledge/parsed`}>
                        <Blocks className="mr-2 h-4 w-4" />
                        <span>Parsed</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/projects/${projectId}/knowledge/chunked`}>
                        <Blocks className="mr-2 h-4 w-4" />
                        <span>Chunked</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`/projects/${projectId}/qa`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>QA</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`/projects/${projectId}/trials`}>
                <FlaskConical className="mr-2 h-4 w-4" />
                <span>Trials</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

