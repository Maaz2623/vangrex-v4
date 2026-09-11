import httpx
import respx

from vangrex import Vangrex


@respx.mock
def test_get_execution():
    respx.get(
        "https://api.vangrex.com/api/v1/executions/execution-123"
    ).mock(
        return_value=httpx.Response(
            200,
            json={
                "id": "execution-123",
                "workflowId": "workflow-123",
                "status": "success",
                "input": {"message": "hello"},
                "output": {"result": "world"},
                "error": None,
                "startedAt": "2026-09-11T10:00:00Z",
                "completedAt": "2026-09-11T10:00:03Z",
                "createdAt": "2026-09-11T10:00:00Z",
            },
        )
    )

    client = Vangrex(api_key="vx_test")

    execution = client.executions.get("execution-123")

    assert execution.id == "execution-123"
    assert execution.workflow_id == "workflow-123"
    assert execution.status == "success"
    assert execution.output == {"result": "world"}

    client.close()


@respx.mock
def test_execution_events():
    respx.get(
        "https://api.vangrex.com/api/v1/executions/execution-123/events"
    ).mock(
        return_value=httpx.Response(
            200,
            headers={"Content-Type": "text/event-stream"},
            content=(
                b'data: {"id":"event-1","executionId":"execution-123",'
                b'"workflowId":"workflow-123","type":"execution.started",'
                b'"timestamp":"2026-09-11T10:00:00Z","data":{}}\n\n'
                b'data: {"id":"event-2","executionId":"execution-123",'
                b'"workflowId":"workflow-123","type":"node.completed",'
                b'"timestamp":"2026-09-11T10:00:01Z",'
                b'"data":{"nodeId":"node-1","status":"success",'
                b'"output":{"value":42}}}\n\n'
            ),
        )
    )

    client = Vangrex(api_key="vx_test")

    events = list(client.executions.events("execution-123"))

    assert len(events) == 2

    assert events[0].type == "execution.started"

    assert events[1].type == "node.completed"
    assert events[1].data.node_id == "node-1"
    assert events[1].data.output == {"value": 42}

    client.close()