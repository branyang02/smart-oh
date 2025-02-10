

/**
 * Cache layer for database operations.
 * NOTE: Currently not implementing caching functionality - direct database calls are being made.
 * All cache-prefixed functions are direct pass-through to their database counterparts.
 *
 * @remarks
 * Originally implemented with next/cache but temporarily disabled.
 * Cache implementation may be restored in future versions.
 */

import { getClassFromClassId, getUserClassesFromUserId } from "@/db/classes";
import { getInstructorsFromClassId, getTAsFromClassId } from "@/db/users";

export const getCachedUserClassesFromUserId = getUserClassesFromUserId;
export const getCachedTAsFromClassId = getTAsFromClassId;
export const getCachedInstructorsFromClassId = getInstructorsFromClassId;
export const getCachedClassFromClassId = getClassFromClassId;

// import { getClassFromClassId, getUserClassesFromUserId } from "@/db/classes";
// import { getInstructorsFromClassId, getTAsFromClassId } from "@/db/users";
// import { unstable_cache } from "next/cache";

// export const getCachedUserClassesFromUserId = unstable_cache(
//     getUserClassesFromUserId,
//     ["user-classes"],
//     { revalidate: 1 }
// );
// export const getCachedTAsFromClassId = unstable_cache(
//     getTAsFromClassId,
//     ["tas"],
//     {
//         revalidate: 1
//     }
// );
// export const getCachedInstructorsFromClassId = unstable_cache(
//     getInstructorsFromClassId,
//     ["instructors"],
//     { revalidate: 1 }
// );
// export const getCachedClassFromClassId = unstable_cache(
//     getClassFromClassId,
//     ["class"],
//     {
//         revalidate: 1
//     }
// );

