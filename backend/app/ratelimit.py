import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import HTTPException, Request, status


class SlidingWindowLimiter:
    """
    Простое ограничение частоты запросов в памяти процесса.
    Достаточно для одного инстанса; при нескольких воркерах нужен Redis.
    """

    def __init__(self, limit: int, window_seconds: int) -> None:
        self.limit = limit
        self.window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def check(self, key: str) -> None:
        now = time.monotonic()
        with self._lock:
            hits = self._hits[key]
            while hits and now - hits[0] > self.window:
                hits.popleft()

            if len(hits) >= self.limit:
                retry_after = int(self.window - (now - hits[0])) + 1
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Слишком много запросов. Попробуйте немного позже.",
                    headers={"Retry-After": str(retry_after)},
                )

            hits.append(now)


def client_ip(request: Request) -> str:
    """Учитывает прокси (Nginx, Vercel, Cloudflare) через X-Forwarded-For."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


# 5 заявок за 10 минут с одного адреса, 10 попыток входа за 5 минут.
leads_limiter = SlidingWindowLimiter(limit=5, window_seconds=600)
login_limiter = SlidingWindowLimiter(limit=10, window_seconds=300)
# Регистрация строже входа: 3 аккаунта в час с одного адреса.
register_limiter = SlidingWindowLimiter(limit=3, window_seconds=3600)
