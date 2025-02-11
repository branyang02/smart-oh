import {
    Announcements,
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    rectIntersection,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./BoardColumn";
import type { Column, ColumnDragData } from "./BoardColumn";
import { type Task, TaskCard } from "./TaskCard";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { hasDraggableData } from "./utils";

const initColumns: Column[] = [
    {
        id: "queue",
        title: "Queue"
    },
    {
        id: "session1",
        title: "Session 1"
    },
    {
        id: "session2",
        title: "Session 2"
    },
    {
        id: "session3",
        title: "Session 3"
    },
    {
        id: "session4",
        title: "Session 4"
    }
];

const initTasks: Task[] = [
    {
        id: "student2",
        columnId: "queue",
        content: "Student 2"
    },
    {
        id: "student1",
        columnId: "queue",
        content: "Student 1"
    },
    {
        id: "student3",
        columnId: "queue",
        content: "Student 3"
    },
    {
        id: "student4",
        columnId: "queue",
        content: "Student 4"
    },
    {
        id: "student5",
        columnId: "queue",
        content: "Student 5"
    },
    {
        id: "ta1",
        columnId: "session1",
        content: "TA 1"
    },
    {
        id: "ta2",
        columnId: "session2",
        content: "TA 2"
    },
    {
        id: "ta5",
        columnId: "session1",
        content: "TA 5"
    },
    {
        id: "ta3",
        columnId: "session3",
        content: "TA 3"
    },
    {
        id: "ta4",
        columnId: "session4",
        content: "TA 4"
    }
];

export function KanbanBoard({
    // initColumns,
    // initTasks,
    sendMessage
}: {
    // initColumns: Column[];
    // initTasks: Task[];
    sendMessage: (msg: { action: string; [key: string]: any }) => void;
}) {
    const [columns, setColumns] = useState(initColumns);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    useEffect(() => {
        setColumns(initColumns);
        setTasks(initTasks);
    }, [initColumns, initTasks]);

    const pickedUpTaskColumn = useRef<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>(initTasks);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [message, setMessage] = useState<{
        action: string;
        [key: string]: any;
    } | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter
        })
    );

    function getDraggingTaskData(taskId: UniqueIdentifier, columnId: string) {
        const tasksInColumn = tasks.filter(
            (task) => task.columnId === columnId
        );
        const taskPosition = tasksInColumn.findIndex(
            (task) => task.id === taskId
        );
        const column = columns.find((col) => col.id === columnId);
        return {
            tasksInColumn,
            taskPosition,
            column
        };
    }

    const announcements: Announcements = {
        onDragStart({ active }) {
            if (!hasDraggableData(active)) return;
            if (active.data.current?.type === "Column") {
                const startColumnIdx = columnsId.findIndex(
                    (id) => id === active.id
                );
                const startColumn = columns[startColumnIdx];
                return `Picked up Column ${startColumn?.title} at position: ${
                    startColumnIdx + 1
                } of ${columnsId.length}`;
            } else if (active.data.current?.type === "Task") {
                pickedUpTaskColumn.current = active.data.current.task.columnId;
                const { tasksInColumn, taskPosition, column } =
                    getDraggingTaskData(active.id, pickedUpTaskColumn.current);
                return `Picked up Task ${
                    active.data.current.task.content
                } at position: ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
        },
        onDragOver({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) return;

            if (
                active.data.current?.type === "Column" &&
                over.data.current?.type === "Column"
            ) {
                const overColumnIdx = columnsId.findIndex(
                    (id) => id === over.id
                );
                return `Column ${active.data.current.column.title} was moved over ${
                    over.data.current.column.title
                } at position ${overColumnIdx + 1} of ${columnsId.length}`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const { tasksInColumn, taskPosition, column } =
                    getDraggingTaskData(
                        over.id,
                        over.data.current.task.columnId
                    );
                if (
                    over.data.current.task.columnId !==
                    pickedUpTaskColumn.current
                ) {
                    return `Task ${
                        active.data.current.task.content
                    } was moved over column ${column?.title} in position ${
                        taskPosition + 1
                    } of ${tasksInColumn.length}`;
                }
                return `Task was moved over position ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
        },
        onDragEnd({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) {
                pickedUpTaskColumn.current = null;
                return;
            }
            if (
                active.data.current?.type === "Column" &&
                over.data.current?.type === "Column"
            ) {
                const overColumnPosition = columnsId.findIndex(
                    (id) => id === over.id
                );

                return `Column ${
                    active.data.current.column.title
                } was dropped into position ${overColumnPosition + 1} of ${
                    columnsId.length
                }`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const { tasksInColumn, taskPosition, column } =
                    getDraggingTaskData(
                        over.id,
                        over.data.current.task.columnId
                    );
                if (
                    over.data.current.task.columnId !==
                    pickedUpTaskColumn.current
                ) {
                    return `Task was dropped into column ${column?.title} in position ${
                        taskPosition + 1
                    } of ${tasksInColumn.length}`;
                }
                return `Task was dropped into position ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
            pickedUpTaskColumn.current = null;
        },
        onDragCancel({ active }) {
            pickedUpTaskColumn.current = null;
            if (!hasDraggableData(active)) return;
            return `Dragging ${active.data.current?.type} cancelled.`;
        }
    };

    return (
        <DndContext
            accessibility={{
                announcements
            }}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            collisionDetection={(args) => {
                // If dragging a task, allow dropping on any column
                const activeData = args.active.data.current as { type: string };
                if (activeData?.type !== "Column") {
                    return rectIntersection(args);
                }

                // If dragging a column, only allow dropping on draggable columns
                const droppableContainers = args.droppableContainers.filter(
                    (container) => {
                        const columnData = container.data
                            .current as ColumnDragData;
                        return columnData?.column?.draggable !== false;
                    }
                );

                return rectIntersection({
                    ...args,
                    droppableContainers
                });
            }}
        >
            <BoardContainer>
                <SortableContext items={columnsId}>
                    <div
                        className="grid gap-4 w-full"
                        style={{
                            gridTemplateColumns: `minmax(250px, 1fr) repeat(auto-fit, minmax(250px, 1fr))`
                        }}
                    >
                        <div>
                            <BoardColumn
                                column={
                                    columns.find((col) => col.id === "queue")!
                                }
                                tasks={tasks.filter(
                                    (task) => task.columnId === "queue"
                                )}
                                draggable={false}
                            />
                        </div>
                        <div
                            className="grid gap-4 auto-rows-max"
                            style={{
                                gridColumn: `2 / -1`,
                                gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`
                            }}
                        >
                            {columns
                                .filter((col) => col.id !== "queue")
                                .map((col) => (
                                    <BoardColumn
                                        key={col.id}
                                        column={col}
                                        tasks={tasks.filter(
                                            (task) => task.columnId === col.id
                                        )}
                                        draggable={false} // TODO: Currently not draggable
                                    />
                                ))}
                        </div>
                    </div>
                </SortableContext>
            </BoardContainer>

            {"document" in window &&
                createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <BoardColumn
                                isOverlay
                                column={activeColumn}
                                tasks={tasks.filter(
                                    (task) => task.columnId === activeColumn.id
                                )}
                            />
                        )}
                        {activeTask && <TaskCard task={activeTask} isOverlay />}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );

    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === "Column") {
            setActiveColumn(data.column);
            return;
        }

        if (data?.type === "Task") {
            setActiveTask(data.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (!hasDraggableData(active)) return;

        const activeData = active.data.current;

        if (activeId === overId) {
            if (message) console.log("Sending message", message);
            // if (message) sendMessage(message);
            return;
        }

        const isActiveAColumn = activeData?.type === "Column";
        if (!isActiveAColumn) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(
                (col) => col.id === activeId
            );

            const overColumnIndex = columns.findIndex(
                (col) => col.id === overId
            );

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        const isActiveATask = activeData?.type === "Task";
        const isOverATask = overData?.type === "Task";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                const activeTask = tasks[activeIndex];
                const overTask = tasks[overIndex];
                if (
                    activeTask &&
                    overTask &&
                    activeTask.columnId !== overTask.columnId
                ) {
                    activeTask.columnId = overTask.columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }
                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = overData?.type === "Column";

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const activeTask = tasks[activeIndex];
                if (activeTask) {
                    activeTask.columnId = overId as string;
                    setMessage({
                        action: "assign_student_to_session",
                        student_id: activeTask.id
                    });
                    return arrayMove(tasks, activeIndex, activeIndex);
                }
                return tasks;
            });
        }
    }
}
