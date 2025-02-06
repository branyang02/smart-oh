import { AppSidebar } from "@/components/app-sidebar";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { EventsProvider } from "@/context/events-context";
import mockData from "@/data";
import { auth } from "@/lib/auth";

interface LayoutProps {
    children: React.ReactNode;
    params: { class_id: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
    const session = await auth();
    const user = {
        name: session?.user?.name || "Guest",
        email: session?.user?.email || "guest@example.com"
    };

    const classes = mockData.classes;

    return (
        <EventsProvider>
            <SidebarProvider>
                <AppSidebar user={user} classes={classes} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4 flex-1">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/class">
                                            Classes
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            Data Fetching
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <div className="ml-auto">
                                <DarkModeToggle />
                            </div>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </EventsProvider>
    );
};

export default Layout;
