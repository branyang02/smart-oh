import { WSUser } from "@/components/office-hour-room";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";

export interface UserDragData {
    type: "user";
    user: WSUser;
}

export function UserCard({
    currUserId,
    currUserType,
    user,
    isOverlay
}: {
    currUserId: string;
    currUserType: "student" | "TA";
    user: WSUser;
    isOverlay?: boolean;
}) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: user.id,
        data: {
            type: "user",
            user: user
        } satisfies UserDragData,
        attributes: {
            roleDescription: `This is a user with id: ${user.id}`
        }
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform)
    };

    const variants = cva("", {
        variants: {
            dragging: {
                over: "ring-2 opacity-30",
                overlay: "ring-2 ring-primary"
            },
            userType: {
                student: "",
                TA: "border-green-500"
            }
        }
    });

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={variants({
                dragging: isOverlay
                    ? "overlay"
                    : isDragging
                      ? "over"
                      : undefined,
                userType: user.type === "TA" ? "TA" : "student"
            })}
        >
            <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
                {currUserType === "TA" &&
                    (currUserId === user.id || user.type === "student") && (
                        <Button
                            variant={"ghost"}
                            {...attributes}
                            {...listeners}
                            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
                        >
                            <span className="sr-only">Move user</span>
                            <GripVertical />
                        </Button>
                    )}
                <Badge variant={"outline"} className="ml-auto font-semibold">
                    {/* {user.type} */}
                    {
                        user.id //Temporary for display purposes
                    }
                </Badge>
            </CardHeader>
            <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
                {user.name}
            </CardContent>
        </Card>
    );
}
