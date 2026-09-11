from __future__ import annotations

from typing import Any

from .client import AsyncVangrexClient, VangrexClient
from .types import RunWorkflowResponse


class WorkflowsResource:
    def __init__(self, client: VangrexClient) -> None:
        self._client = client

    def run(
        self,
        workflow_id: str,
        input: Any = None,
    ) -> RunWorkflowResponse:
        self._validate_workflow_id(workflow_id)

        response = self._client.post(
            f"/api/v1/workflows/{workflow_id}/executions",
            json={
                "input": {} if input is None else input,
            },
        )

        return RunWorkflowResponse(
            execution_id=response["executionId"],
            status=response["status"],
        )

    @staticmethod
    def _validate_workflow_id(workflow_id: str) -> None:
        if not isinstance(workflow_id, str) or not workflow_id.strip():
            raise ValueError("workflow_id must be a non-empty string")


class AsyncWorkflowsResource:
    def __init__(self, client: AsyncVangrexClient) -> None:
        self._client = client

    async def run(
        self,
        workflow_id: str,
        input: Any = None,
    ) -> RunWorkflowResponse:
        if not isinstance(workflow_id, str) or not workflow_id.strip():
            raise ValueError("workflow_id must be a non-empty string")

        response = await self._client.post(
            f"/api/v1/workflows/{workflow_id}/executions",
            json={
                "input": {} if input is None else input,
            },
        )

        return RunWorkflowResponse(
            execution_id=response["executionId"],
            status=response["status"],
        )