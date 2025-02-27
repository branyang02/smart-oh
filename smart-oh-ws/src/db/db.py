import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from psycopg.rows import class_row
from psycopg_pool import AsyncConnectionPool, ConnectionPool

from src.websocket.state import User

load_dotenv()
connection_string = os.getenv("DATABASE_URL")

pool = AsyncConnectionPool(conninfo=connection_string, open=False)


async def _get_user_by_user_id(user_id: str) -> User:
    async with pool.connection() as conn:
        async with conn.cursor(row_factory=class_row(User)) as cur:
            await cur.execute(
                """
                SELECT "id", "name", "email", "emailVerified", "image"
                FROM "user"
                WHERE "id" = %s
                LIMIT 1
                """,
                (user_id,),
            )
            user = await cur.fetchone()

            if not user:
                raise KeyError(f"User ID {user_id} not found")

            return user


async def get_user_by_session_token(session_token: str) -> User:
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                """
                SELECT "userId", "expires"
                FROM "session"
                WHERE "sessionToken" = %s
                LIMIT 1
                """,
                (session_token,),
            )
            session_row = await cur.fetchone()

            user_id, expires = session_row

            if not session_row:
                raise KeyError(f"Session token {session_token} not found")

            now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
            if expires < now_utc:
                raise ValueError(f"Session token {session_token} has expired")

            return _get_user_by_user_id(user_id)


async def get_role_by_user_id_class_id(user_id: str, class_id: str) -> str:
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                """
                SELECT "role"
                FROM "user_class"
                WHERE "user_id" = %s AND "class_id" = %s
                LIMIT 1
                """,
                (user_id, class_id),
            )
            role_row = await cur.fetchone()

            if not role_row:
                raise KeyError(f"User ID {user_id} not found in class {class_id}")

            return role_row[0]
