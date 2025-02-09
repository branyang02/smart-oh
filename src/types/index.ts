

/**
 * Type definitions for the application
 * 
 * This file redefines User and Class types with required fields while keeping
 * UserClass from the ORM as is.
 * 
 * @remarks
 * User and Class types are modified versions of their ORM counterparts
 * to ensure required fields are properly typed
 * 
 * @packageDocumentation
 */

import { User as ORMUser, Class as ORMClass, UserClass } from '@/db/schema';

type Class = {
    id: string; // id is required
    number: string; // same as ORMClass
    name: string; // same as ORMClass
    semester: string; // same as ORMClass
    createdAt?: Date; // same as ORMClass
};

type User = {
    id: string; // id is required
    name: string; // name is required
    email: string; // email is required
    emailVerified?: Date | null | undefined; // same as ORMUser
    image?: string | null | undefined; // same as ORMUser
};

export type { User, Class, UserClass };
