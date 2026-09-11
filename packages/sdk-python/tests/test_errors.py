import httpx
import pytest
import respx

from vangrex import Vangrex, VangrexError


@respx.mock
def test_api_error():
    respx.get(
        "https://api.vangrex.com/api/v1/executions/bad-execution"
    ).mock(
        return_value=httpx.Response(
            404,
            json={
                "error": "Execution not found",
            },
        )
    )

    client = Vangrex(api_key="vx_test")

    with pytest.raises(VangrexError) as exc_info:
        client.executions.get("bad-execution")

    error = exc_info.value

    assert error.status == 404
    assert error.message == "Execution not found"
    assert error.body == {"error": "Execution not found"}

    client.close()


def test_empty_api_key():
    with pytest.raises(ValueError):
        Vangrex(api_key="")