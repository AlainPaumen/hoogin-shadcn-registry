import type {
  SidebarBrand,
  SidebarNavItem,
  SidebarSecondaryItem,
} from "@/hoogin/ui/sidebar.types"

import favicon from "@/assets/favicon.svg"

import {
  BlocksIcon,
  CompassIcon,
  LayoutTemplateIcon,
  MessageSquareIcon,
  StarIcon,
} from "lucide-react"

export const sidebarData = {
  brand: {
    name: "@hoogin",
    description: "shadcn registry",
    logo: favicon,
  },
  navMainLabel: "Docs",
  navMain: [
    {
      title: "Getting Started",
      url: "/docs/introduction",
      icon: CompassIcon,
      isActive: true,
      items: [
        {
          title: "Introduction",
          url: "/docs/introduction",
        },
        {
          title: "Installation",
          url: "/docs/installation",
        },
      ],
    },
    {
      title: "Components",
      url: "/docs/components",
      icon: BlocksIcon,
      items: [
        {
          title: "Overview",
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
              title: "Overview",
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
          title: "Theme Provider",
          url: "/docs/components/theme-provider",
        },
        {
          title: "Theme Toggle",
          url: "/docs/components/theme-toggle",
        },
      ],
    },
    {
      title: "Blocks",
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
      ],
    },
  ],
  navSecondary: [
    {
      title: "Star on GitHub",
      url: "https://github.com/AlainPaumen/hoogin-shadcn-registry",
      icon: StarIcon,
    },
    {
      title: "Open an issue",
      url: "https://github.com/AlainPaumen/hoogin-shadcn-registry/issues",
      icon: MessageSquareIcon,
    },
  ],
} satisfies {
  brand?: SidebarBrand
  navMainLabel?: string
  navMain: SidebarNavItem[]
  navSecondary?: SidebarSecondaryItem[]
}
