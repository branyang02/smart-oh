import { User } from "@/types";

export type QueuePositionProps = {
    position: number;
    user: User;
};

export const QueuePosition = ({ position, user }: QueuePositionProps) => {
    return (
        <div className="w-full md:flex-1 md:max-w-md rounded-lg border p-3 shadow-sm flex items-center gap-3">
            <div
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300"
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
            <div className="text-gray-500 ml-auto">{position}</div>
        </div>
    );
};
