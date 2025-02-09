"use client";

import { Class, User } from "@/types";
import { createContext, useContext } from "react";

interface ClassContextType {
    userClasses: (Class & {
        role: string;
    })[];
    courseTAs?: User[];
    courseInstructors?: User[];
    activeClass?: Class;
}

const ClassContext = createContext<ClassContextType | null>(null);

export function ClassProvider({
    children,
    value
}: {
    children: React.ReactNode;
    value: ClassContextType;
}) {
    return (
        <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
    );
}

export function useClass() {
    const context = useContext(ClassContext);
    if (!context) throw new Error("useClass must be used within ClassProvider");
    return context;
}
