import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type UniqueIdentifier, useDndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { useMemo } from "react";

import { Task, TaskCard } from "./TaskCard";

export interface Column {
    id: UniqueIdentifier;
    title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
    type: ColumnType;
    column: Column & { draggable?: boolean };
}

interface BoardColumnProps {
    column: Column;
    tasks: Task[];
    isOverlay?: boolean;
    draggable?: boolean;
}

export function BoardColumn({
    column,
    tasks,
    isOverlay,
    draggable
}: BoardColumnProps) {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column: {
                ...column,
                draggable
            }
        } satisfies ColumnDragData,
        attributes: {
            roleDescription: `Column: ${column.title}`
        }
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform)
    };

    const variants = cva(
        "bg-primary-foreground flex flex-col flex-shrink-0 min-h-[200px]",
        {
            variants: {
                dragging: {
                    default: "border-2 border-transparent",
                    over: "ring-2 opacity-30",
                    overlay: "ring-2 ring-primary"
                }
            }
        }
    );

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={variants({
                dragging: isOverlay
                    ? "overlay"
                    : isDragging
                      ? "over"
                      : undefined
            })}
        >
            <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
                {draggable && (
                    <Button
                        variant={"ghost"}
                        {...attributes}
                        {...listeners}
                        className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
                    >
                        <span className="sr-only">{`Move column: ${column.title}`}</span>
                        <GripVertical />
                    </Button>
                )}
                <span className="ml-auto"> {column.title}</span>
            </CardHeader>
            <ScrollArea>
                <CardContent className="flex flex-grow flex-col gap-2 p-2">
                    <SortableContext items={tasksIds}>
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </SortableContext>
                </CardContent>
            </ScrollArea>
        </Card>
    );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
    const dndContext = useDndContext();

    const variations = cva("px-2 md:px-0 pb-4", {
        variants: {
            dragging: {
                default: "snap-x snap-mandatory",
                active: "snap-none"
            }
        }
    });

    return (
        <ScrollArea
            className={variations({
                dragging: dndContext.active ? "active" : "default"
            })}
        >
            {/* <div className="flex gap-4 items-center flex-row justify-center"> */}
            <div className="flex gap-4">{children}</div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
