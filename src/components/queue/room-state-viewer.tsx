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
    if (!roomState) return <div>Loading room state...</div>;

    const queueColumn = {
        id: "queue",
        title: "Queue"
    };
    const taSessionsColumns = roomState.sessions.map((session) => ({
        id: session.session_id,
        title: `Session ${session.session_id}`
    }));
    const initCols = [queueColumn, ...taSessionsColumns];

    const studentsInQueue: Task[] = roomState.queue.map((student) => ({
        id: student.id,
        columnId: "queue",
        content: student.name
    }));
    const studentsInSessions: Task[] = roomState.sessions.flatMap((session) =>
        session.session_students.map((student) => ({
            id: student,
            columnId: session.session_id,
            content: student
        }))
    );
    const initTasks = [...studentsInQueue, ...studentsInSessions];
    return (
        <>
            <KanbanBoard
                // initColumns={initCols}
                // initTasks={initTasks}
                sendMessage={sendMessage}
            />
            <div className="p-4">
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Queue</h2>
                    {roomState.queue.length === 0 ? (
                        <p>No students in queue</p>
                    ) : (
                        <ul className="space-y-2">
                            {roomState.queue.map((student) => (
                                <li
                                    key={student.id}
                                    className="p-2 bg-gray-100 rounded"
                                >
                                    {student.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-3">Active Sessions</h2>
                    {roomState.sessions.length === 0 ? (
                        <p>No active sessions</p>
                    ) : (
                        <ul className="space-y-4">
                            {roomState.sessions.map((session) => (
                                <li
                                    key={session.session_id}
                                    className="p-3 bg-blue-50 rounded"
                                >
                                    <p className="font-semibold">
                                        Session ID: {session.session_id}
                                    </p>
                                    <p>TAs: {session.session_tas.length}</p>
                                    <p>
                                        Students:{" "}
                                        {session.session_students.length}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default RoomStateViewer;
