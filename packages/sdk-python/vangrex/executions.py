from __future__ import annotations

import json
from collections.abc import AsyncIterator, Iterator
from typing import Any

from .client import AsyncVangrexClient, VangrexClient
from .types import Execution, ExecutionEvent, ExecutionEventData


class ExecutionsResource:
    def __init__(self, client: VangrexClient) -> None:
        self._client = client

    def get(self, execution_id: str) -> Execution:
        self._validate_execution_id(execution_id)

        response = self._client.get(
            f"/api/v1/executions/{execution_id}"
        )

        return self._parse_execution(response)

    def events(self, execution_id: str) -> Iterator[ExecutionEvent]:
        self._validate_execution_id(execution_id)

        data_lines: list[str] = []

        for line in self._client.stream(
            f"/api/v1/executions/{execution_id}/events"
        ):
            # SSE comments / keep-alives
            if line.startswith(":"):
                continue

            if line.startswith("data:"):
                data_lines.append(line[5:].lstrip())
                continue

            # An empty line terminates an SSE event.
            if not line.strip():
                if data_lines:
                    event = self._parse_event("\n".join(data_lines))

                    if event is not None:
                        yield event

                    data_lines.clear()

        # Handle a final event without a trailing blank line.
        if data_lines:
            event = self._parse_event("\n".join(data_lines))

            if event is not None:
                yield event

    @staticmethod
    def _validate_execution_id(execution_id: str) -> None:
        if not isinstance(execution_id, str) or not execution_id.strip():
            raise ValueError("execution_id must be a non-empty string")

    @staticmethod
    def _parse_execution(data: dict[str, Any]) -> Execution:
        return Execution(
            id=data["id"],
            workflow_id=data["workflowId"],
            status=data["status"],
            input=data.get("input"),
            output=data.get("output"),
            error=data.get("error"),
            started_at=data.get("startedAt"),
            completed_at=data.get("completedAt"),
            created_at=data["createdAt"],
        )

    @staticmethod
    def _parse_event(raw: str) -> ExecutionEvent | None:
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            # Match the TypeScript SDK behaviour:
            # malformed events should not break the stream.
            return None

        event_data = data.get("data") or {}

        return ExecutionEvent(
            id=data["id"],
            execution_id=data["executionId"],
            workflow_id=data["workflowId"],
            type=data["type"],
            timestamp=data["timestamp"],
            data=ExecutionEventData(
                node_id=event_data.get("nodeId"),
                status=event_data.get("status"),
                output=event_data.get("output"),
                error=event_data.get("error"),
            ),
        )


class AsyncExecutionsResource:
    def __init__(self, client: AsyncVangrexClient) -> None:
        self._client = client

    async def get(self, execution_id: str) -> Execution:
        self._validate_execution_id(execution_id)

        response = await self._client.get(
            f"/api/v1/executions/{execution_id}"
        )

        return ExecutionsResource._parse_execution(response)

    async def events(
        self,
        execution_id: str,
    ) -> AsyncIterator[ExecutionEvent]:
        self._validate_execution_id(execution_id)

        data_lines: list[str] = []

        async for line in self._client.stream(
            f"/api/v1/executions/{execution_id}/events"
        ):
            if line.startswith(":"):
                continue

            if line.startswith("data:"):
                data_lines.append(line[5:].lstrip())
                continue

            if not line.strip():
                if data_lines:
                    event = ExecutionsResource._parse_event(
                        "\n".join(data_lines)
                    )

                    if event is not None:
                        yield event

                    data_lines.clear()

        if data_lines:
            event = ExecutionsResource._parse_event(
                "\n".join(data_lines)
            )

            if event is not None:
                yield event

    @staticmethod
    def _validate_execution_id(execution_id: str) -> None:
        if not isinstance(execution_id, str) or not execution_id.strip():
            raise ValueError("execution_id must be a non-empty string")