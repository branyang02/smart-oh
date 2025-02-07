import {
    getClassFromClassId,
    getCourseStaffForClassFromClassId,
    getUserClassesFromUserId
} from "@/lib/classes";
import { unstable_cache } from "next/cache";

export const getCachedUserClasses = unstable_cache(
    getUserClassesFromUserId,
    ["user-classes"],
    { revalidate: 1 }
);
export const getCachedCourseStaff = unstable_cache(
    getCourseStaffForClassFromClassId,
    ["course-staff"],
    { revalidate: 1 }
);
export const getCachedClass = unstable_cache(getClassFromClassId, ["class"], {
    revalidate: 1
});
