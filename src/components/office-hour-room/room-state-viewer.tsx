import { WSRoomState, WSUser } from "@/components/office-hour-room";
import {
    Announcements,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import React, { act, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BoardColumn } from "./board-column";
import { BoardContainer } from "./board-container";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { UserCard } from "./user-card";
import { hasDraggableData, hasDroppableData } from "./utils";

const rawRoomState = {
    class_id: "cs101",
    all_users: [
        { id: "student1", name: "Alice Student", type: "student" },
        { id: "student2", name: "Bob Student", type: "student" },
        { id: "student3", name: "Charlie Student", type: "student" },
        { id: "student4", name: "David Student", type: "student" },
        { id: "student5", name: "Eve Student", type: "student" },
        { id: "student6", name: "Frank Student", type: "student" },
        { id: "student7", name: "Grace Student", type: "student" },
        { id: "student8", name: "Hank Student", type: "student" },
        { id: "student9", name: "Ivy Student", type: "student" },
        { id: "ta1", name: "John TA", type: "TA" },
        { id: "ta2", name: "Jane TA", type: "TA" }
    ],
    queue: [
        {
            id: "student5",
            name: "Eve Student",
            type: "student",
            location: "queue"
        },
        {
            id: "student6",
            name: "Frank Student",
            type: "student",
            location: "queue"
        },
        {
            id: "student7",
            name: "Grace Student",
            type: "student",
            location: "queue"
        },
        {
            id: "student8",
            name: "Hank Student",
            type: "student",
            location: "queue"
        },
        {
            id: "student9",
            name: "Ivy Student",
            type: "student",
            location: "queue"
        }
    ],
    sessions: {
        "session-1": {
            id: "session-1",
            users: [
                {
                    id: "student1",
                    name: "Alice Student",
                    type: "student",
                    location: "session-1"
                },
                {
                    id: "student4",
                    name: "David Student",
                    type: "student",
                    location: "session-1"
                },
                {
                    id: "ta1",
                    name: "John TA",
                    type: "TA",
                    location: "session-1"
                }
            ]
        },
        "session-2": {
            id: "session-2",
            users: [
                {
                    id: "student3",
                    name: "Charlie Student",
                    type: "student",
                    location: "session-2"
                },
                {
                    id: "ta2",
                    name: "Jane TA",
                    type: "TA",
                    location: "session-2"
                }
            ]
        }
    }
};

function processRoomState(state: WSRoomState): WSRoomState {
    return {
        ...state,
        sessions: new Map(
            Object.entries(state.sessions).map(([key, session]) => [
                key,
                session
            ])
        )
    };
}

export default function RoomStateViewer({
    newRoomState,
    sendMessage
}: {
    newRoomState: WSRoomState;
    sendMessage: (msg: { action: string; [key: string]: any }) => void;
}) {
    if (!newRoomState) return <div>Loading room state...</div>;
    const [roomState, setRoomState] = useState(() =>
        processRoomState(newRoomState)
    );

    useEffect(() => {
        setRoomState(processRoomState(newRoomState));
    }, [newRoomState]);

    const sessionids = Object.keys(roomState.sessions);

    const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
    const [activeUser, setActiveUser] = useState<WSUser | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter
        })
    );

    const announcements: Announcements = {
        onDragStart({ active }) {
            return `Picked up draggable item ${active.id}.`;
        },
        onDragOver({ active, over }) {
            if (over) {
                return `Draggable item ${active.id} was moved over droppable area ${over.id}.`;
            }

            return `Draggable item ${active.id} is no longer over a droppable area.`;
        },
        onDragEnd({ active, over }) {
            if (over) {
                return `Draggable item ${active.id} was dropped over droppable area ${over.id}`;
            }

            return `Draggable item ${active.id} was dropped.`;
        },
        onDragCancel({ active }) {
            return `Dragging was cancelled. Draggable item ${active.id} was dropped.`;
        }
    };

    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === "user") {
            setActiveUser(data.user);
            return;
        }
    }
    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        const activeData = active.data.current;
        const overData = over.data.current;
        console.log(`onDragEnd: ${activeId} -> ${overId}`);
        console.log("Active Column: ", activeColumnId);
        console.log(activeData?.user.location);

        setActiveUser(null);
        setActiveColumnId(null);
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;
        if (!hasDraggableData(active) || !hasDroppableData(over)) return;
        const activeData = active.data.current;
        const overData = over.data.current;
        if (!activeData || !overData) return;
        const isOverUser = overData?.type === "user";
        const isOverColumn = overData?.type === "column";

        if (isOverUser) {
            setRoomState((prev) => {
                // 1. Dropper over other user in the same column
                if (
                    activeData.user.location &&
                    overData.user.location &&
                    activeData.user.location === overData.user.location
                ) {
                    const location = activeData.user.location;
                    if (location === "queue") {
                        const activeIndex = prev.queue.findIndex(
                            (user) => user.id === activeData.user.id
                        );
                        const overIndex = prev.queue.findIndex(
                            (user) => user.id === overData.user.id
                        );
                        setActiveColumnId("queue");
                        return {
                            ...prev,
                            queue: arrayMove(prev.queue, activeIndex, overIndex)
                        };
                    } else if (prev.sessions.has(location)) {
                        const session = prev.sessions.get(location);
                        if (!session) return prev;
                        const activeIndex = session.users.findIndex(
                            (user) => user.id === activeData.user.id
                        );
                        const overIndex = session.users.findIndex(
                            (user) => user.id === overData.user.id
                        );
                        setActiveColumnId(location);
                        return {
                            ...prev,
                            sessions: new Map(prev.sessions).set(location, {
                                ...session,
                                users: arrayMove(
                                    session.users,
                                    activeIndex,
                                    overIndex
                                )
                            })
                        };
                    }
                } else if (
                    activeData.user.location &&
                    overData.user.location &&
                    activeData.user.location !== overData.user.location
                ) {
                    const newLocation = overData.user.location;
                    if (newLocation === "queue") {
                        // Move from session to queue
                        const prevLocation = activeData.user.location;
                        const prevSession = prev.sessions.get(prevLocation);
                        if (!prevSession) return prev;
                        // Remove from session
                        const newSession = {
                            ...prevSession,
                            users: prevSession.users.filter(
                                (user) => user.id !== activeData.user.id
                            )
                        };
                        activeData.user.location = "queue";
                        // Add to queue with correct index
                        const overIndex = prev.queue.findIndex(
                            (user) => user.id === overData.user.id
                        );
                        setActiveColumnId("queue");
                        return {
                            ...prev,
                            queue: [
                                ...prev.queue.slice(0, overIndex),
                                activeData.user,
                                ...prev.queue.slice(overIndex)
                            ],
                            sessions: new Map(prev.sessions).set(
                                prevLocation,
                                newSession
                            )
                        };
                    } else if (prev.sessions.has(newLocation)) {
                        if (activeData.user.location === "queue") {
                            // Move from queue to session
                            const newSession = prev.sessions.get(newLocation);
                            if (!newSession) return prev;
                            const overIndex = newSession.users.findIndex(
                                (user) => user.id === overData.user.id
                            );
                            activeData.user.location = newLocation;
                            setActiveColumnId(newLocation);
                            return {
                                ...prev,
                                queue: prev.queue.filter(
                                    (user) => user.id !== activeData.user.id
                                ),
                                sessions: new Map(prev.sessions).set(
                                    newLocation,
                                    {
                                        ...newSession,
                                        users: [
                                            ...newSession.users.slice(
                                                0,
                                                overIndex
                                            ),
                                            activeData.user,
                                            ...newSession.users.slice(overIndex)
                                        ]
                                    }
                                )
                            };
                        } else if (
                            prev.sessions.has(activeData.user.location)
                        ) {
                            // Move from session to session
                            const prevLocation = activeData.user.location;
                            const prevSession = prev.sessions.get(prevLocation);
                            if (!prevSession) return prev;
                            // Remove from previous session
                            const newPrevSession = {
                                ...prevSession,
                                users: prevSession.users.filter(
                                    (user) => user.id !== activeData.user.id
                                )
                            };
                            activeData.user.location = newLocation;
                            // Add to new session with correct index
                            const newSession = prev.sessions.get(newLocation);
                            if (!newSession) return prev;
                            const overIndex = newSession.users.findIndex(
                                (user) => user.id === overData.user.id
                            );
                            setActiveColumnId(newLocation);
                            return {
                                ...prev,
                                sessions: new Map(prev.sessions)
                                    .set(prevLocation, newPrevSession)
                                    .set(newLocation, {
                                        ...newSession,
                                        users: [
                                            ...newSession.users.slice(
                                                0,
                                                overIndex
                                            ),
                                            activeData.user,
                                            ...newSession.users.slice(overIndex)
                                        ]
                                    })
                            };
                        }
                    }
                }
                return prev;
            });
        }

        if (isOverColumn) {
            setRoomState((prev) => {
                if (overId === "queue") {
                    const prevLocation = activeData.user.location;
                    if (!prevLocation) return prev;
                    if (prevLocation === "queue") return prev;
                    const session = prev.sessions.get(prevLocation);
                    if (!session) return prev;
                    const newSession = {
                        ...session,
                        users: session.users.filter(
                            (user) => user.id !== activeData.user.id
                        )
                    };
                    activeData.user.location = "queue";
                    setActiveColumnId("queue");
                    return {
                        ...prev,
                        queue: [...prev.queue, activeData.user],
                        sessions: new Map(prev.sessions).set(
                            prevLocation,
                            newSession
                        )
                    };
                } else if (prev.sessions.has(overId as string)) {
                    const prevLocation = activeData.user.location;
                    if (!prevLocation) return prev;
                    if (prevLocation === overId) return prev;

                    if (prev.sessions.has(prevLocation)) {
                        const session = prev.sessions.get(prevLocation);
                        if (!session) return prev;
                        const prevSession = {
                            ...session,
                            users: session.users.filter(
                                (user) => user.id !== activeData.user.id
                            )
                        };
                        activeData.user.location = overId as string;
                        const newSession = prev.sessions.get(overId as string);
                        if (!newSession) return prev;
                        setActiveColumnId(overId as string);
                        return {
                            ...prev,
                            sessions: new Map(prev.sessions)
                                .set(prevLocation, prevSession)
                                .set(overId as string, {
                                    ...newSession,
                                    users: [
                                        ...newSession.users,
                                        activeData.user
                                    ]
                                })
                        };
                    } else if (prevLocation === "queue") {
                        activeData.user.location = overId as string;
                        const newSession = prev.sessions.get(overId as string);
                        if (!newSession) return prev;
                        setActiveColumnId(overId as string);
                        return {
                            ...prev,
                            queue: prev.queue.filter(
                                (user) => user.id !== activeData.user.id
                            ),
                            sessions: new Map(prev.sessions).set(
                                overId as string,
                                {
                                    ...newSession,
                                    users: [
                                        ...newSession.users,
                                        activeData.user
                                    ]
                                }
                            )
                        };
                    }
                }
                return prev;
            });
        }
    }

    return (
        <DndContext
            accessibility={{
                announcements
            }}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <BoardContainer>
                <SortableContext items={[...sessionids, "queue"]}>
                    <div
                        className="grid gap-4 w-full"
                        style={{
                            gridTemplateColumns: `minmax(250px, 1fr) repeat(auto-fit, minmax(250px, 1fr))`
                        }}
                    >
                        <div>
                            <BoardColumn queue={roomState.queue} />
                        </div>
                        <div
                            className="grid gap-4 auto-rows-max"
                            style={{
                                gridColumn: `2 / -1`,
                                gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`
                            }}
                        >
                            {Array.from(roomState.sessions.values()).map(
                                (session) => (
                                    <BoardColumn
                                        key={session.id}
                                        session={session}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </SortableContext>
            </BoardContainer>

            {"document" in window &&
                createPortal(
                    <DragOverlay>
                        {activeUser && <UserCard user={activeUser} isOverlay />}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );
}
