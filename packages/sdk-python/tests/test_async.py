import httpx
import pytest
import respx

from vangrex import AsyncVangrex


@pytest.mark.asyncio
@respx.mock
async def test_async_run_workflow():
    respx.post(
        "https://api.vangrex.com/api/v1/workflows/workflow-123/executions"
    ).mock(
        return_value=httpx.Response(
            200,
            json={
                "executionId": "execution-123",
                "status": "pending",
            },
        )
    )

    client = AsyncVangrex(api_key="vx_test")

    result = await client.workflows.run(
        "workflow-123",
        {"message": "hello"},
    )

    assert result.execution_id == "execution-123"
    assert result.status == "pending"

    await client.close()


@pytest.mark.asyncio
@respx.mock
async def test_async_get_execution():
    respx.get(
        "https://api.vangrex.com/api/v1/executions/execution-123"
    ).mock(
        return_value=httpx.Response(
            200,
            json={
                "id": "execution-123",
                "workflowId": "workflow-123",
                "status": "success",
                "input": {},
                "output": {"result": "done"},
                "error": None,
                "startedAt": None,
                "completedAt": None,
                "createdAt": "2026-09-11T10:00:00Z",
            },
        )
    )

    client = AsyncVangrex(api_key="vx_test")

    execution = await client.executions.get("execution-123")

    assert execution.id == "execution-123"
    assert execution.status == "success"
    assert execution.output == {"result": "done"}

    await client.close()