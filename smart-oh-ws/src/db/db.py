import os
from datetime import datetime, timezone
from typing import Optional, Tuple

from dotenv import load_dotenv
from psycopg_pool import ConnectionPool

from src.websocket.state import User

load_dotenv()
db_url = os.getenv("DATABASE_URL")

# Global connection pool
conn_string = (
    f"{db_url}"
    "&keepalives=1"
    "&keepalives_idle=30"
    "&keepalives_interval=10"
    "&keepalives_count=5"
)
pool = ConnectionPool(
    conninfo=conn_string, open=True, max_lifetime=180
)  # recreate connections after 3 minutes


def get_user_and_role(session_token: str, class_id: str) -> Tuple[User, Optional[str]]:
    """
    Fetch the user based on session_token, ensure the session isn't expired,
    and get the user's role in the specified class (if any).

    Returns:
        A tuple: (user_object, role_string_or_None).

    Raises:
        KeyError: if no matching session row is found.
        ValueError: if the session token has expired.
    """
    query = """
    SELECT
      s."userId"       AS session_user_id,
      s."expires"      AS session_expires,
      u."id"           AS user_id,
      u."name"         AS name,
      u."email"        AS email,
      u."emailVerified" AS emailverified,
      u."image"        AS image,
      uc."role"        AS role
    FROM "session" AS s
    JOIN "user" AS u
      ON s."userId" = u."id"
    LEFT JOIN "user_class" AS uc
      ON u."id" = uc."user_id"
      AND uc."class_id" = %s
    WHERE s."sessionToken" = %s
    LIMIT 1
    """

    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (class_id, session_token))
            row = cur.fetchone()

            if row is None:
                # No row => invalid session token
                raise KeyError(f"No session found for token: {session_token}")

            # Parse results
            _, expires, user_id, name, email, email_verified, image, role = row

            # Check if expired
            now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
            if expires < now_utc:
                raise ValueError("Session token has expired")

            # Build User object
            user = User(
                id=user_id,
                name=name,
                email=email,
                emailVerified=email_verified,
                image=image,
            )

    return user, role
