import type {
  SidebarMore,
  SidebarNavItem,
  SidebarProject,
  SidebarSecondaryItem,
  SidebarUser,
} from "@/hoogin/app-sidebar/sidebar.types"

import {                                                                                                                                                                                                       
  BookOpenIcon,
  FrameIcon,
  LifeBuoyIcon,                                                                                                                                                                                                
  MapIcon,                                                                                                                                                                                                     
  PieChartIcon,                                                                                                                                                                                                
  SendIcon,                                                                                                                                                                                                    
  Settings2Icon,                                                                                                                                                                                               
  TerminalSquareIcon,                                                                                                                                                                                          
} from "lucide-react"

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMainLabel: "Title",
  projectsLabel: "Reports",
  projectsMore: {
    label: "More",
    url: "#",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: TerminalSquareIcon,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpenIcon,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2Icon,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoyIcon,
    },
    {
      title: "Feedback",
      url: "#",
      icon: SendIcon,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: FrameIcon,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChartIcon,
    },
    {
      name: "Travel",
      url: "#",
      icon: MapIcon,
    },
  ],
} satisfies {
  user?: SidebarUser
  navMainLabel?: string
  projectsLabel?: string
  projectsMore?: SidebarMore
  navMain: SidebarNavItem[]
  navSecondary?: SidebarSecondaryItem[]
  projects?: SidebarProject[]
}
