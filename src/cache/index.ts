import {
    getClassFromClassId,
    getUserClassesFromUserId,
} from "@/db/classes";
import { getInstructorsFromClassId, getTAsFromClassId } from "@/db/users";
import { unstable_cache } from "next/cache";

export const getCachedUserClassesFromUserId = unstable_cache(
    getUserClassesFromUserId,
    ["user-classes"],
    { revalidate: 1 }
);
export const getCachedTAsFromClassId = unstable_cache(getTAsFromClassId, ["tas"], {
    revalidate: 1
});
export const getCachedInstructorsFromClassId = unstable_cache(
    getInstructorsFromClassId,
    ["instructors"],
    { revalidate: 1 }
);
export const getCachedClassFromClassId = unstable_cache(getClassFromClassId, ["class"], {
    revalidate: 1
});
