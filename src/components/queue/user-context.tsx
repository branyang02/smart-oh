"use client";

import { User } from "@/types";
import { createContext, useContext } from "react";

interface CurrUserContextType {
    currUser: User;
    currUserType: "student" | "TA";
}

const CurrUserContext = createContext<CurrUserContextType | null>(null);

export function CurrUserProvider({
    children,
    value
}: {
    children: React.ReactNode;
    value: CurrUserContextType;
}) {
    return (
        <CurrUserContext.Provider value={value}>
            {children}
        </CurrUserContext.Provider>
    );
}

export function useCurrUser() {
    const context = useContext(CurrUserContext);
    if (!context)
        throw new Error("useCurrUser must be used within CurrUserProvider");
    return context;
}
