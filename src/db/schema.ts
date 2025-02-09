import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from '@paralleldrive/cuid2';

// Auth.js required tables, copied from https://authjs.dev/getting-started/adapters/drizzle?framework=next-js 
export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
})

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
)

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
)

export const classes = pgTable("class", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name").notNull(),
    number: text("number").notNull(),
    semester: text("semester").notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const rolesEnum = pgEnum("roles", ["student", "TA", "instructor"]);

export const userClasses = pgTable("user_class", {
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    classId: text("class_id")
        .notNull()
        .references(() => classes.id),
    role: rolesEnum("roles").notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
    primaryKey({ columns: [table.userId, table.classId] }),
]
);

export type User = typeof users.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type UserClass = typeof userClasses.$inferSelect;
