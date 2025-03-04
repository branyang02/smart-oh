import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "../ui/input";

type EditableTitleProps = {
    title: string;
    onTitleChange: (newTitle: string) => void;
    isEditable?: boolean;
};

export function EditableTitle({
    title,
    onTitleChange,
    isEditable = true
}: EditableTitleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setNewTitle(title);
    }, [title]);

    function handleDoubleClick() {
        if (!isEditable) return;
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    function handleBlur() {
        setIsEditing(false);
        if (newTitle.trim() !== "") {
            onTitleChange(newTitle.trim());
        } else {
            setNewTitle(title); // Revert if empty
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            handleBlur();
        }
    }

    return (
        <div
            className={`relative group text-lg font-semibold flex items-center ${isEditable ? "cursor-pointer" : ""}`}
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <Input
                    ref={inputRef}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="border border-secondary rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            ) : (
                <div className="flex items-center gap-1">
                    {newTitle}
                    {isEditable && (
                        <Pencil
                            className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity"
                            onClick={handleDoubleClick}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
