"use client";

import { Class, UserClass } from "@/types";
import { createContext, useContext } from "react";

interface ClassContextType {
    userClasses: UserClass[];
    courseStaff: UserClass[];
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
