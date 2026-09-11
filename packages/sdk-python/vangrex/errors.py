from typing import Any


class VangrexError(Exception):
    """
    Error raised when a Vangrex API request fails.
    """

    def __init__(
        self,
        message: str,
        *,
        status: int | None = None,
        body: Any = None,
    ) -> None:
        super().__init__(message)

        self.message = message
        self.status = status
        self.body = body

    def __str__(self) -> str:
        if self.status is not None:
            return f"{self.message} (HTTP {self.status})"

        return self.message