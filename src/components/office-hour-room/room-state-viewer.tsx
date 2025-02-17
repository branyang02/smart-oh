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

const rawRoomState: WSRoomState = {
    classId: "cs101",
    allUsers: [
        {
            id: "student1",
            columnId: "none",
            name: "Alice Student",
            type: "student"
        },
        {
            id: "student2",
            columnId: "none",
            name: "Bob Student",
            type: "student"
        },
        {
            id: "student3",
            columnId: "none",
            name: "Charlie Student",
            type: "student"
        },
        {
            id: "student4",
            columnId: "none",
            name: "David Student",
            type: "student"
        },
        {
            id: "student5",
            columnId: "none",
            name: "Eve Student",
            type: "student"
        },
        {
            id: "student6",
            columnId: "none",
            name: "Frank Student",
            type: "student"
        },
        {
            id: "student7",
            columnId: "none",
            name: "Grace Student",
            type: "student"
        },
        {
            id: "student8",
            columnId: "none",
            name: "Hank Student",
            type: "student"
        },
        {
            id: "student9",
            columnId: "none",
            name: "Ivy Student",
            type: "student"
        },
        { id: "ta1", columnId: "none", name: "John TA", type: "TA" },
        { id: "ta2", columnId: "none", name: "Jane TA", type: "TA" },
        { id: "ta3", columnId: "none", name: "Kate TA", type: "TA" }
    ],
    users: [
        {
            id: "student5",
            columnId: "queue",
            name: "Eve Student",
            type: "student"
        },
        {
            id: "student6",
            columnId: "queue",
            name: "Frank Student",
            type: "student"
        },
        {
            id: "student7",
            columnId: "queue",
            name: "Grace Student",
            type: "student"
        },
        {
            id: "student8",
            columnId: "queue",
            name: "Hank Student",
            type: "student"
        },
        {
            id: "student9",
            columnId: "queue",
            name: "Ivy Student",
            type: "student"
        },
        {
            id: "student1",
            columnId: "session-1",
            name: "Alice Student",
            type: "student"
        },
        {
            id: "student4",
            columnId: "session-1",
            name: "David Student",
            type: "student"
        },
        { id: "ta1", columnId: "session-1", name: "John TA", type: "TA" },
        {
            id: "student3",
            columnId: "session-2",
            name: "Charlie Student",
            type: "student"
        },
        { id: "ta2", columnId: "session-2", name: "Jane TA", type: "TA" },
        { id: "ta3", columnId: "session-3", name: "Kate TA", type: "TA" }
    ],
    columns: [
        { id: "queue", title: "Queue" },
        { id: "session-1", title: "session-1" },
        { id: "session-2", title: "session-2" },
        { id: "session-3", title: "session-3" }
    ]
};

export default function RoomStateViewer({
    newRoomState,
    sendMessage
}: {
    newRoomState: WSRoomState;
    sendMessage: (msg: { action: string; [key: string]: any }) => void;
}) {
    if (!newRoomState) return <div>Loading room state...</div>;
    const [roomState, setRoomState] = useState(() => rawRoomState);

    // useEffect(() => {
    //     setRoomState(newRoomState);
    // }, [newRoomState]);

    const columnIds = roomState.columns.map((column) => column.id);
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
        if (!hasDraggableData(event.active)) return;

        const activeId = active.id;
        const overId = over.id;

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
                <SortableContext items={columnIds}>
                    <div
                        className="grid gap-4 w-full"
                        style={{
                            gridTemplateColumns: `minmax(250px, 1fr) repeat(auto-fit, minmax(250px, 1fr))`
                        }}
                    >
                        <div>
                            <BoardColumn
                                column={
                                    roomState.columns.find(
                                        (col) => col.id === "queue"
                                    )!
                                }
                                users={roomState.users.filter(
                                    (user) => user.columnId === "queue"
                                )}
                            />
                        </div>
                        <div
                            className="grid gap-4 auto-rows-max"
                            style={{
                                gridColumn: `2 / -1`,
                                gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`
                            }}
                        >
                            {roomState.columns
                                .filter((col) => col.id !== "queue")
                                .map((column) => {
                                    return (
                                        <BoardColumn
                                            key={column.id}
                                            column={column}
                                            users={roomState.users.filter(
                                                (user) =>
                                                    user.columnId === column.id
                                            )}
                                        />
                                    );
                                })}
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
