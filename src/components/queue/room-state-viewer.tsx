import { UniqueIdentifier } from "@dnd-kit/core";
import { FC, useState } from "react";

import type { Column } from "./BoardColumn";
import { KanbanBoard } from "./KanbanBoard";
import { type Task, TaskCard } from "./TaskCard";

interface Student {
    id: string;
    name: string;
}

interface TA {
    id: string;
    name: string;
}

interface Session {
    session_id: string;
    session_tas: string[];
    session_students: string[];
}

interface RoomState {
    class_id: string;
    students: Student[];
    tas: TA[];
    queue: Student[];
    sessions: Session[];
}

interface RoomStateViewerProps {
    roomState: RoomState | null;
    sendMessage: (msg: { action: string; [key: string]: any }) => void;
}

const RoomStateViewer: FC<RoomStateViewerProps> = ({
    roomState,
    sendMessage
}) => {
    // if (!roomState) return <div>Loading room state...</div>;

    return (
        <>
            <KanbanBoard sendMessage={sendMessage} />
        </>
    );
};

export default RoomStateViewer;
