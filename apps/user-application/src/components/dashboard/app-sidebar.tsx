'use client';

import {
  Bug,
  ChartBar,
  Code,
  CreditCard,
  Database,
  Folder,
  Gauge,
  Gear,
  ListChecks,
  MagnifyingGlass,
  NotePencil,
  Question,
  Robot,
  SquaresFour,
  Table,
  Users,
} from '@phosphor-icons/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar';
import * as React from 'react';

import { NavDocuments } from './nav-documents';
import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/app',
      icon: Gauge,
    },
    {
      title: 'Subscriptions',
      url: '/app/polar/subscriptions',
      icon: CreditCard,
    },
    {
      title: 'Analytics',
      url: '/app/analytics',
      icon: ChartBar,
    },
    {
      title: 'Projects',
      url: '/app/projects',
      icon: Folder,
    },
    {
      title: 'Team',
      url: '/app/team',
      icon: Users,
    },
  ],
  navDemos: [
    {
      title: 'AI Chat',
      url: '/demo/ai-chat',
      icon: Robot,
    },
    {
      title: 'AI Image',
      url: '/demo/ai-image',
      icon: Robot,
    },
    {
      title: 'AI Structured',
      url: '/demo/ai-structured',
      icon: Robot,
    },
    {
      title: 'Table',
      url: '/demo/table',
      icon: Table,
    },
    {
      title: 'Forms',
      url: '/demo/form/simple',
      icon: NotePencil,
    },
    {
      title: 'MCP Todos',
      url: '/demo/mcp-todos',
      icon: ListChecks,
    },
    {
      title: 'Sentry',
      url: '/demo/sentry/testing',
      icon: Bug,
    },
    {
      title: 'DB Chat',
      url: '/demo/db-chat',
      icon: Database,
    },
    {
      title: 'TanStack Query',
      url: '/demo/tanstack-query',
      icon: Code,
    },
    {
      title: 'Store',
      url: '/demo/store',
      icon: Database,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/app/settings',
      icon: Gear,
    },
    {
      title: 'Get Help',
      url: '/app/help',
      icon: Question,
    },
    {
      title: 'Search',
      url: '/app/search',
      icon: MagnifyingGlass,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '/app/data',
    },
    {
      name: 'Reports',
      url: '/app/reports',
    },
    {
      name: 'Documentation',
      url: '/app/docs',
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href="/app" />}
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <SquaresFour className="size-5!" />
              <span className="text-base font-semibold">SaaS Kit</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain items={data.navDemos} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
