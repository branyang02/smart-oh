import {
    BookOpen,
    Bot,
    Frame,
    Map,
    PieChart,
    Settings2,
    SquareTerminal
} from "lucide-react";

import { UserRole } from "./types";

const mockData = {
    classes: [
        {
            className: "Machine Learning",
            semester: "Fall 2021",
            role: "student" as UserRole
        },
        {
            className: "Calculus III",
            semester: "Fall 2021",
            role: "student" as UserRole
        },
        {
            className: "Data Structures",
            semester: "Spring 2022",
            role: "TA" as UserRole
        },
        {
            className: "Algorithms",
            semester: "Spring 2022",
            role: "instructor" as UserRole
        }
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#"
                },
                {
                    title: "Starred",
                    url: "#"
                },
                {
                    title: "Settings",
                    url: "#"
                }
            ]
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#"
                },
                {
                    title: "Explorer",
                    url: "#"
                },
                {
                    title: "Quantum",
                    url: "#"
                }
            ]
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#"
                },
                {
                    title: "Get Started",
                    url: "#"
                },
                {
                    title: "Tutorials",
                    url: "#"
                },
                {
                    title: "Changelog",
                    url: "#"
                }
            ]
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#"
                },
                {
                    title: "Team",
                    url: "#"
                },
                {
                    title: "Billing",
                    url: "#"
                },
                {
                    title: "Limits",
                    url: "#"
                }
            ]
        }
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart
        },
        {
            name: "Travel",
            url: "#",
            icon: Map
        }
    ]
};

export default mockData;
