from .client import (
    AsyncVangrexClient,
    VangrexClient,
)
from .errors import VangrexError
from .executions import (
    AsyncExecutionsResource,
    ExecutionsResource,
)
from .types import (
    Execution,
    ExecutionEvent,
    ExecutionEventData,
    ExecutionEventType,
    ExecutionStatus,
    RunWorkflowResponse,
)
from .workflows import (
    AsyncWorkflowsResource,
    WorkflowsResource,
)


class Vangrex:
    """
    Official Vangrex Python SDK.
    """

    def __init__(
        self,
        api_key: str,
        *,
        base_url: str = "https://api.vangrex.com",
        timeout: float = 30.0,
    ) -> None:
        self._client = VangrexClient(
            api_key,
            base_url=base_url,
            timeout=timeout,
        )

        self.workflows = WorkflowsResource(self._client)
        self.executions = ExecutionsResource(self._client)

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "Vangrex":
        return self

    def __exit__(self, *args: object) -> None:
        self.close()


class AsyncVangrex:
    """
    Asynchronous Vangrex Python SDK.
    """

    def __init__(
        self,
        api_key: str,
        *,
        base_url: str = "https://api.vangrex.com",
        timeout: float = 30.0,
    ) -> None:
        self._client = AsyncVangrexClient(
            api_key,
            base_url=base_url,
            timeout=timeout,
        )

        self.workflows = AsyncWorkflowsResource(self._client)
        self.executions = AsyncExecutionsResource(self._client)

    async def close(self) -> None:
        await self._client.close()

    async def __aenter__(self) -> "AsyncVangrex":
        return self

    async def __aexit__(self, *args: object) -> None:
        await self.close()


__all__ = [
    "Vangrex",
    "AsyncVangrex",
    "VangrexClient",
    "AsyncVangrexClient",
    "VangrexError",
    "WorkflowsResource",
    "AsyncWorkflowsResource",
    "ExecutionsResource",
    "AsyncExecutionsResource",
    "RunWorkflowResponse",
    "Execution",
    "ExecutionEvent",
    "ExecutionEventData",
    "ExecutionEventType",
    "ExecutionStatus",
]


VERSION = "0.1.0"