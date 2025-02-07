'use client'
import { Calendar, Dumbbell, User, LayoutDashboard, MoveLeft } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";

export function AppSidebar() {


    const router = useRouter();

    const items = [
        {
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboard,
        },
        {
            title: "Sessions",
            url: "/sessions",
            icon: Calendar,
        },
        {
            title: "Exercises",
            url: "/exercises",
            icon: Dumbbell,
        }
    ];

    const footerItems = [
        {
            title: "Profile",
            url: "/profile",
            icon: User,
        }
    ];

    return (
        <Sidebar collapsible="icon" className="shadow-2xl">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem key="back-button" className="cursor-pointer">
                        <SidebarMenuButton asChild onClick={() => router.back()}>
                            <div>
                                <MoveLeft />
                                <span>Back</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter>
                <SidebarMenu>
                    {footerItems.map((footerItem) => (
                        <SidebarMenuItem key={footerItem.title}>
                            <SidebarMenuButton asChild>
                                <a href={footerItem.url}>
                                    <footerItem.icon />
                                    <span>{footerItem.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter >
        </Sidebar >
    )
}
