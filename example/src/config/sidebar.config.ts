import type {
  SidebarBrand,
  SidebarNavItem,
  SidebarSecondaryItem,
  SidebarUser,
  SidebarUserMenu,
} from "@/hoogin/ui/navigation/sidebar.types"

import favicon from "@/assets/favicon.svg"
import { m } from "@/paraglide/messages.js"

import {
  BlocksIcon,
  BellIcon,
  CompassIcon,
  CreditCardIcon,
  LayoutTemplateIcon,
  LogOutIcon,
  MessageSquareIcon,
  StarIcon,
  UserIcon,
} from "lucide-react"

export const sidebarData = {
  brand: {
    name: "@hoogin",
    description: `shadcn registry v${__LIB_VERSION__}`,
    logo: favicon,
  },
  navMainLabel: m.nav_docs(),
  navMain: [
    {
      title: m.nav_gettingStarted(),
      url: "/docs/introduction",
      icon: CompassIcon,
      isActive: true,
      items: [
        {
          title: m.nav_introduction(),
          url: "/docs/introduction",
        },
        {
          title: m.nav_installation(),
          url: "/docs/installation",
        },
      ],
    },
    {
      title: m.nav_components(),
      url: "/docs/components",
      icon: BlocksIcon,
      items: [
        {
          title: m.nav_overview(),
          url: "/docs/components",
        },
        {
          title: "Spinner",
          url: "/docs/components/spinner",
        },
        {
          title: "Data Table",
          url: "/docs/components/data-table",
        },
        {
          title: "Data Table Cells",
          url: "/docs/components/data-table-cells",
        },
        {
          title: "Data Table View Options",
          url: "/docs/components/data-table-view-options",
        },
        {
          title: "Form Fields",
          url: "/docs/components/form-fields",
          items: [
            {
              title: m.nav_overview(),
              url: "/docs/components/form-fields",
            },
            {
              title: "Form Text Field",
              url: "/docs/components/form-text-field",
            },
            {
              title: "Form Email Field",
              url: "/docs/components/form-email-field",
            },
            {
              title: "Form Password Field",
              url: "/docs/components/form-password-field",
            },
            {
              title: "Form Strong Password Field",
              url: "/docs/components/form-strong-password-field",
            },
            {
              title: "Form Number Field",
              url: "/docs/components/form-number-field",
            },
            {
              title: "Form Currency Field",
              url: "/docs/components/form-currency-field",
            },
            {
              title: "Form Date Field",
              url: "/docs/components/form-date-field",
            },
            {
              title: "Form Time Field",
              url: "/docs/components/form-time-field",
            },
            {
              title: "Form Select Field",
              url: "/docs/components/form-select-field",
            },
            {
              title: "Form Textarea Field",
              url: "/docs/components/form-textarea-field",
            },
            {
              title: "Form Checkbox Field",
              url: "/docs/components/form-checkbox-field",
            },
          ],
        },
        {
          title: "Sidebar",
          url: "/docs/components/sidebar",
        },
        {
          title: "App Sidebar",
          url: "/docs/components/app-sidebar",
        },
        {
          title: "Auth Provider",
          url: "/docs/components/auth-provider",
        },
        {
          title: "Theme Provider",
          url: "/docs/components/theme-provider",
        },
        {
          title: "Theme Toggle",
          url: "/docs/components/theme-toggle",
        },
        {
          title: "Locale Toggle",
          url: "/docs/components/locale-toggle",
        },
      ],
    },
    {
      title: m.nav_blocks(),
      url: "/docs/blocks/sidebar-layout",
      icon: LayoutTemplateIcon,
      items: [
        {
          title: "Sidebar Layout",
          url: "/docs/blocks/sidebar-layout",
        },
        {
          title: "Admin Page",
          url: "/docs/blocks/admin-page",
        },
        {
          title: "Signup Page",
          url: "/docs/blocks/signup-page",
        },
        {
          title: "Signin Page",
          url: "/docs/blocks/signin-page",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: m.nav_starGithub(),
      url: "https://github.com/AlainPaumen/hoogin-shadcn-registry",
      icon: StarIcon,
    },
    {
      title: m.nav_openIssue(),
      url: "https://github.com/AlainPaumen/hoogin-shadcn-registry/issues",
      icon: MessageSquareIcon,
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/me.jpg",
  },
  userMenu: [
    {
      items: [
        { label: m.nav_account(), url: "/", icon: UserIcon },
        { label: m.nav_billing(), url: "/", icon: CreditCardIcon },
        { label: m.nav_notifications(), url: "/", icon: BellIcon },
      ],
    },
    {
      items: [{ label: m.nav_logOut(), url: "/", icon: LogOutIcon }],
    },
  ],
} satisfies {
  brand?: SidebarBrand
  navMainLabel?: string
  navMain: SidebarNavItem[]
  navSecondary?: SidebarSecondaryItem[]
  user?: SidebarUser
  userMenu?: SidebarUserMenu
}
