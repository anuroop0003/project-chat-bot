'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { BotMessageSquare } from 'lucide-react'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '#'
    },
    {
      title: 'Lifecycle',
      url: '#'
    },
    {
      title: 'Analytics',
      url: '#'
    },
    {
      title: 'Projects',
      url: '#'
    },
    {
      title: 'Team',
      url: '#'
    }
  ],
  navClouds: [
    {
      title: 'Capture',
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#'
        },
        {
          title: 'Archived',
          url: '#'
        }
      ]
    },
    {
      title: 'Proposal',
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#'
        },
        {
          title: 'Archived',
          url: '#'
        }
      ]
    },
    {
      title: 'Prompts',
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#'
        },
        {
          title: 'Archived',
          url: '#'
        }
      ]
    }
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#'
    },
    {
      title: 'Get Help',
      url: '#'
    },
    {
      title: 'Search',
      url: '#'
    }
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#'
    },
    {
      name: 'Reports',
      url: '#'
    },
    {
      name: 'Word Assistant',
      url: '#'
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent cursor-default'>
              <span>
                <a href='#' className='flex items-center gap-1 cursor-pointer'>
                  <span className='p-1.5 rounded-md'>
                    <BotMessageSquare className='!size-8' />
                  </span>
                  <span className='text-base font-semibold'>Chat Bot.</span>
                </a>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
