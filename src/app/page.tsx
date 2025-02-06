import { AppSidebar } from "@/components/app-sidebar";
import Calendar from "@/components/calendar";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { LoginForm } from "@/components/login-form";
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

export default async function Home() {
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        );
    }

    const user = {
        name: session.user.name || "hehe",
        email: session.user.email || "hehe"
    };

    const classes = mockData.classes;

    return (
        <EventsProvider>
            <SidebarProvider>
                <AppSidebar user={user} classes={classes} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
                        <div className="flex items-center gap-2 px-4 flex-1">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Building Your Application
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
                            <div className="ml-auto px-4 py-2">
                                <DarkModeToggle />
                            </div>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="aspect-video rounded-xl bg-muted/50" />
                            <div className="aspect-video rounded-xl bg-muted/50" />
                            <div className="aspect-video rounded-xl bg-muted/50" />
                        </div>
                        {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min border-4 border-red-600"> */}
                        <Calendar />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </EventsProvider>
    );
}
