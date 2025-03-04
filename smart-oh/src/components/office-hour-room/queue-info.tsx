import { useClass } from "@/context/class-context";

import { TColumn } from "./data";

export default function QueueInfo({
    column,
    userCurrentColumnId
}: {
    column: TColumn;
    userCurrentColumnId?: string;
}) {
    const { user, activeRole } = useClass();
    if (activeRole !== "student" || column.id !== userCurrentColumnId) {
        return (
            <div className="relative group text-sm text-muted-foreground">
                {`Queue length: ${column.cards.length}`}
            </div>
        );
    }

    const position =
        column.cards.findIndex((card) => card.user.id === user.id) + 1;

    return (
        <div className="relative group text-sm text-muted-foreground">
            {`Your position: ${position}`}
        </div>
    );
}
