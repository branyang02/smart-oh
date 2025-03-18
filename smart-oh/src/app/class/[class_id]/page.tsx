"use client";

import { AppHeader } from "@/components/app-header";
import OfficeHourRoom from "@/components/office-hour-room";
import { useClass } from "@/context/class-context";

export default function ClassPage() {
    const { activeClass, activeRole } = useClass();
    if (!activeClass || !activeRole) return null;

    return (
        <>
            <AppHeader
                breadcrumbs={[
                    {
                        href: `/class/${activeClass.id}`,
                        label: activeClass.name
                    }
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <OfficeHourRoom currClassId={activeClass.id} />
            </div>
        </>
    );
}
