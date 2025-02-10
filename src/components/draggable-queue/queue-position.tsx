import { User } from "@/types";

export type QueuePositionProps = {
    height: number;
    position: number; // The index. To be rendered as p+1
    user: User;
    isPreview?: boolean;
    onDragStart?: (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        user: User,
        position: number
    ) => void;
    onDragOver?: (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        position: number
    ) => void;
    style?: React.CSSProperties;
};

export const QueuePosition = ({
    height,
    position,
    user,
    isPreview,
    onDragStart,
    onDragOver,
    style
}: QueuePositionProps) => {
    return (
        <div
            className={`
							w-full rounded-lg border p-3 shadow-sm flex items-center gap-3 bg-white dark:bg-gray-900 relative select-none box-border
							${isPreview ? "opacity-25 bg-gray-300 dark:bg-gray-700" : ""}`}
            style={{ height, ...style }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onDragStart?.(e, user, position);
            }}
        >
            <div
                // The area for the top half - drag over for before
                onMouseOver={(e) => {
                    // Check left button down
                    if (e.buttons === 1) {
                        e.stopPropagation();
                        onDragOver?.(e, position);
                    }
                }}
                className="w-full h-1/2 absolute top-0 left-0"
            ></div>
            <div
                // The area for the bottom half - drag over for before
                onMouseOver={(e) => {
                    // Check left button down
                    if (e.buttons === 1) {
                        e.stopPropagation();
                        onDragOver?.(e, position + 1);
                    }
                }}
                className="w-full h-1/2 absolute bottom-0 left-0"
            ></div>
            <div
                className="rounded-full overflow-hidden border relative"
                style={{ width: height / 1.5, height: height / 1.5 }}
            >
                <div
                    className="w-full h-full bg-cover bg-center absolute z-10"
                    style={{ backgroundImage: `url(${user.image})` }}
                ></div>
                {/* TODO: Add some hashing fn to get a unique color by userId? */}
                <div className="w-full h-full bg-cover bg-center flex items-center justify-center text-gray-500 font-bold absolute z-0">
                    {user.name.charAt(0) ?? "U"}
                </div>
            </div>
            <div>{user.name}</div>
            <div className="text-gray-500 ml-auto">{position + 1}</div>
            <div className="cursor-pointer">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v.01M12 10v.01M12 14v.01M12 18v.01M16 6v.01M16 10v.01M16 14v.01M16 18v.01"
                    />
                </svg>
            </div>
        </div>
    );
};
