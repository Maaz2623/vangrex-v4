import httpx
import respx

from vangrex import Vangrex


@respx.mock
def test_run_workflow():
    route = respx.post(
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

    client = Vangrex(api_key="vx_test")

    result = client.workflows.run(
        "workflow-123",
        {"message": "hello"},
    )

    assert result.execution_id == "execution-123"
    assert result.status == "pending"

    assert route.called
    assert route.calls[0].request.headers["Authorization"] == "Bearer vx_test"

    client.close()


def test_invalid_workflow_id():
    client = Vangrex(api_key="vx_test")

    try:
        client.workflows.run("")
    except ValueError as exc:
        assert str(exc) == "workflow_id must be a non-empty string"
    else:
        raise AssertionError("Expected ValueError")

    client.close()