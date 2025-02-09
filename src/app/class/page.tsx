import { getCachedUserClassesFromUserId } from "@/cache";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { getUser } from "@/utils/user-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClassForms } from "./class-form";

export default async function ClassPage() {
    // This page is only rendered if the user is not in a class
    const user = await getUser();

    const userClasses = await Promise.resolve(
        getCachedUserClassesFromUserId(user.id)
    );
    if (userClasses.length > 0) {
        const cookieStore = cookies();
        const lastVisitedClassId = (await cookieStore).get(
            "lastVisitedClassId"
        )?.value;
        if (
            lastVisitedClassId &&
            userClasses.some((c) => c.id === lastVisitedClassId)
        ) {
            console.log("redirecting to last visited class");
            redirect(`/class/${lastVisitedClassId}`);
        } else {
            redirect(`/class/${userClasses[0].id}`);
        }
    }

    return (
        <>
            <AppSidebar user={user} />
            <SidebarInset>
                <AppHeader
                    breadcrumbs={[
                        {
                            href: `/class`,
                            label: "Join/Create a Course"
                        }
                    ]}
                />
                <div className="flex flex-1 flex-col min-h-screen">
                    <ClassForms user={user} />
                </div>
            </SidebarInset>
        </>
    );
}
