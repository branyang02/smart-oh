import logging
from http.cookies import SimpleCookie
from urllib.parse import parse_qs

from fastapi import WebSocket, status

from src.db.db import get_user_and_role

logger = logging.getLogger("uvicorn.error")


async def authenticate_websocket(websocket: WebSocket, class_id: str):
    """
    Authenticate the websocket connection using cookies.
    If authentication fails, close the connection.
    """
    # 1) Try to read the auth token from the "authjs.session-token" cookie
    cookie_header = websocket.headers.get("cookie")
    session_token = None

    if cookie_header:
        cookies = SimpleCookie()
        cookies.load(cookie_header)
        session_cookie = cookies.get("authjs.session-token")
        if session_cookie:
            session_token = session_cookie.value

    # 2) If no token in the cookie, look for a "token" query param
    if not session_token:
        logger.info("Cookie token not found, checking query param...")
        query_str = websocket.scope.get("query_string", b"").decode(
            "utf-8"
        )  # e.g. "token=abc123"
        parsed_params = parse_qs(query_str)  # returns dict like {"token": ["abc123"]}
        token_from_query = parsed_params.get("token", [None])[
            0
        ]  # first element or None
        session_token = token_from_query

    # 3) If still no token, close the connection
    if not session_token:
        logger.warning("No session token found in cookie or query param.")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None

    user, role = get_user_and_role(session_token, class_id)

    return user, role
