import type {
  SidebarBrand,
  SidebarMore,
  SidebarNavItem,
  SidebarProject,
  SidebarSecondaryItem,
  SidebarUser,
  SidebarUserMenu,
} from "@/hoogin/ui/sidebar.types"

import favicon from "@/assets/favicon.svg"

import {                                                                                                                                                                                                       
  BadgeCheckIcon,
  BellIcon,
  BookOpenIcon,
  CreditCardIcon,
  FrameIcon,
  LifeBuoyIcon,                                                                                                                                                                                                
  MapIcon,                                                                                                                                                                                                     
  PieChartIcon,                                                                                                                                                                                                
  SendIcon,                                                                                                                                                                                                    
  Settings2Icon,                                                                                                                                                                                               
  TerminalSquareIcon,                                                                                                                                                                                          
  LogOutIcon,
  SparklesIcon,
} from "lucide-react"

export const sidebarData = {
  brand: {
    name: "Acme Inc",
    description: "Enterprise",
    logo: favicon,
  },
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navUserMenu: [
    {
      items: [{ label: "Upgrade to Pro", url: "#", icon: SparklesIcon }],
    },
    {
      items: [
        { label: "Account", url: "#", icon: BadgeCheckIcon },
        { label: "Billing", url: "#", icon: CreditCardIcon },
        { label: "Notifications", url: "#", icon: BellIcon },
      ],
    },
    {
      items: [{ label: "Log out", url: "#", icon: LogOutIcon }],
    },
  ],
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
  brand?: SidebarBrand
  user?: SidebarUser
  navUserMenu?: SidebarUserMenu
  navMainLabel?: string
  projectsLabel?: string
  projectsMore?: SidebarMore
  navMain: SidebarNavItem[]
  navSecondary?: SidebarSecondaryItem[]
  projects?: SidebarProject[]
}
