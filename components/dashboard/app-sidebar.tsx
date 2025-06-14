"use client"
import * as React from "react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "../documentation/nav-user";
import { useAuth } from "@/contexts/AuthContext";

// This is sample data.
const data = {
  user: {
    name: "Kanishk Kumar",
    email: "kanishkkumar127@gmail.com",
    // avatar: "/images/UserProfile.png",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
    },
    {
      title: "Build",
      url: "#",
      items: [
        {
          title: "Assistants",
          url: "/dashboard/assistants",
          isActive: true,
        },
        {
          title: "Workflows",
          url: "/dashboard/workflows",
        },
        {
          title: "Tools",
          url: "/dashboard/tools",
        },
      ],
    },
    {
      title: "Organization Settings",
      url: "#",
      items: [
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Members",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <Image
                  src="/images/SmallLogo.png"
                  alt="Logo"
                  width={28}
                  height={28}
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user}  /> : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
