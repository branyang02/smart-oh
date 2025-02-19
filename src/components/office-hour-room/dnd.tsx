import { Board } from "@/components/office-hour-room/board";
import { TBoard } from "@/components/office-hour-room/data";
import { Button } from "@/components/ui/button";

const DummyRoomState: TBoard = {
    classId: "class1",
    allUsers: [
        {
            user: {
                id: "student1",
                name: "Alice Student",
                email: "alice@example.com",
                emailVerified: null,
                image: null
            },
            role: "student"
        },
        {
            user: {
                id: "student2",
                name: "Bob Learner",
                email: "bob@example.com",
                emailVerified: null,
                image: null
            },
            role: "student"
        },
        {
            user: {
                id: "ta1",
                name: "Charlie Assistant",
                email: "charlie@example.com",
                emailVerified: null,
                image: null
            },
            role: "TA"
        },
        {
            user: {
                id: "student3",
                name: "David Scholar",
                email: "david@example.com",
                emailVerified: null,
                image: null
            },
            role: "student"
        },
        {
            user: {
                id: "ta2",
                name: "Eve Mentor",
                email: "eve@example.com",
                emailVerified: null,
                image: null
            },
            role: "TA"
        },
        {
            user: {
                id: "student4",
                name: "Frank Learner",
                email: "frank@example.com",
                emailVerified: null,
                image: null
            },
            role: "student"
        },
        {
            user: {
                id: "ta3",
                name: "Grace Tutor",
                email: "grace@example.com",
                emailVerified: null,
                image: null
            },
            role: "TA"
        },
        {
            user: {
                id: "student5",
                name: "Hannah Student",
                email: "hannah@example.com",
                emailVerified: null,
                image: null
            },
            role: "student"
        },
        {
            user: {
                id: "ta4",
                name: "Isaac Assistant",
                email: "isaac@example.com",
                emailVerified: null,
                image: null
            },
            role: "TA"
        },
        {
            user: {
                id: "student6",
                name: "Jack Learner",
                email: "jack@example.com",
                emailVerified: null,
                image: null
            },
            role: "student"
        }
    ],
    columns: [
        {
            id: "queue",
            title: "Queue",
            cards: [
                {
                    user: {
                        id: "student1",
                        name: "Alice Student",
                        email: "alice@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "student"
                },
                {
                    user: {
                        id: "student2",
                        name: "Bob Learner",
                        email: "bob@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "student"
                },
                {
                    user: {
                        id: "student3",
                        name: "David Scholar",
                        email: "david@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "student"
                },
                {
                    user: {
                        id: "student4",
                        name: "Frank Learner",
                        email: "frank@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "student"
                },
                {
                    user: {
                        id: "student5",
                        name: "Hannah Student",
                        email: "hannah@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "student"
                }
            ]
        },
        {
            id: "session-1",
            title: "session-1",
            cards: [
                {
                    user: {
                        id: "ta4",
                        name: "Isaac Assistant",
                        email: "isaac@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "TA"
                },
                {
                    user: {
                        id: "student6",
                        name: "Jack Learner",
                        email: "jack@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "student"
                }
            ]
        },
        {
            id: "session-2",
            title: "session-2",
            cards: [
                {
                    user: {
                        id: "ta3",
                        name: "Grace Tutor",
                        email: "grace@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "TA"
                }
            ]
        },
        {
            id: "session-3",
            title: "session-3",
            cards: [
                {
                    user: {
                        id: "ta2",
                        name: "Eve Mentor",
                        email: "eve@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "TA"
                }
            ]
        },
        {
            id: "session-4",
            title: "session-4",
            cards: []
        },
        {
            id: "session-5",
            title: "session-5",
            cards: [
                {
                    user: {
                        id: "ta1",
                        name: "Charlie Assistant",
                        email: "charlie@example.com",
                        emailVerified: null,
                        image: null
                    },
                    role: "TA"
                }
            ]
        },
        {
            id: "session-6",
            title: "session-6",
            cards: []
        },
        {
            id: "session-7",
            title: "session-7",
            cards: []
        }
    ]
};

export default function DnD({
    newRoomState,
    handleRoomStateChange
}: {
    newRoomState: TBoard;
    handleRoomStateChange: (newRoomState: TBoard) => void;
}) {
    return (
        <div>
            <Button
                onClick={() => {
                    handleRoomStateChange(DummyRoomState);
                }}
            >
                Use Dummy Data
            </Button>
            <Board
                initial={newRoomState}
                handleRoomStateChange={handleRoomStateChange}
            />
        </div>
    );
}
