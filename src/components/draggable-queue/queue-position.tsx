import { User } from "@/types";

export type QueuePositionProps = {
    position: number; // The index. To be rendered as p+1
    user: User;
    isPreview?: boolean;
    onDragStart?: (user: User, position: number) => void;
    onDragOver?: (position: number) => void;
    style?: React.CSSProperties;
};

export const QueuePosition = ({
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
							w-full md:flex-1 md:max-w-md rounded-lg border p-3 shadow-sm flex items-center gap-3 bg-white dark:bg-gray-900 
							${isPreview ? "opacity-25 bg-gray-300 dark:bg-gray-700" : ""}`}
            style={{
                position: "relative",
                userSelect: "none",
                order: position,
                ...style
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onDragStart?.(user, position);
            }}
        >
            <div
                // The area for the top half - drag over for before
                onMouseOver={(e) => {
                    // Check left button down
                    if (e.buttons === 1) {
                        e.stopPropagation();
                        onDragOver?.(position);
                    }
                }}
                style={{
                    width: "100%",
                    height: "50%",
                    position: "absolute",
                    top: 0,
                    left: 0
                }}
            ></div>
            <div
                // The area for the bottom half - drag over for before
                onMouseOver={(e) => {
                    // Check left button down
                    if (e.buttons === 1) {
                        e.stopPropagation();
                        onDragOver?.(position + 1);
                    }
                }}
                style={{
                    width: "100%",
                    height: "50%",
                    position: "absolute",
                    bottom: 0,
                    left: 0
                }}
            ></div>
            <div
                className="w-10 h-10 rounded-full overflow-hidden border"
                style={{ position: "relative" }}
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${user.image})`,
                        position: "absolute",
                        zIndex: 2
                    }}
                ></div>
                {/* TODO: Add some hashing fn to get a unique color by userId? */}
                <div
                    className="w-full h-full bg-cover bg-center flex items-center justify-center text-gray-500 font-bold"
                    style={{
                        position: "absolute",
                        zIndex: 1
                    }}
                >
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
