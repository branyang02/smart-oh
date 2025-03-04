import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const urlRegex = /(https?:\/\/[^\s]+)/g;

type EditableDescriptionProps = {
    description?: string;
    onDescriptionChange: (newDescription: string) => void;
    isEditable?: boolean;
    placeholder?: string;
};

export function EditableDescription({
    description,
    onDescriptionChange,
    isEditable = true,
    placeholder = "Enter session details..."
}: EditableDescriptionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newDescription, setNewDescription] = useState(description ?? "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setNewDescription(description ?? "");
    }, [description]);

    function handleDoubleClick() {
        if (!isEditable) return;
        setIsEditing(true);
        setTimeout(() => textareaRef.current?.focus(), 0);
    }

    function handleBlur() {
        setIsEditing(false);
        if (newDescription.trim() !== "") {
            onDescriptionChange(newDescription.trim());
        } else {
            setNewDescription(""); // Ensure empty input remains empty
            onDescriptionChange(""); // Pass an empty string instead of undefined
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        }
    }

    function renderDescription(text: string) {
        return text.split(urlRegex).map((part, index) =>
            urlRegex.test(part) ? (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                    {part}
                </a>
            ) : (
                <span key={index} className="break-words">
                    {part}
                </span>
            )
        );
    }

    return (
        <div
            className={`relative group text-sm text-muted-foreground ${
                isEditable ? "cursor-pointer" : ""
            } w-full`}
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <Textarea
                    ref={textareaRef}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="border rounded p-2 focus:ring-2 w-full"
                />
            ) : (
                <div className="w-full">
                    {newDescription.trim() !== "" ? (
                        <div className="w-full inline">
                            <span className="whitespace-pre-wrap break-words">
                                {renderDescription(newDescription)}
                            </span>
                            {isEditable && (
                                <Pencil
                                    className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50 transition-opacity cursor-pointer inline align-text-bottom"
                                    onClick={handleDoubleClick}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="inline-flex items-center">
                            <span className="italic text-muted-foreground">
                                {placeholder}
                            </span>
                            {isEditable && (
                                <Pencil
                                    className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50 transition-opacity cursor-pointer inline-block align-text-bottom"
                                    onClick={handleDoubleClick}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
