from __future__ import annotations

from collections.abc import AsyncIterator, Iterator
from typing import Any, TypeVar

import httpx

from .errors import VangrexError

T = TypeVar("T")


DEFAULT_BASE_URL = "https://api.vangrex.com"


class VangrexClient:
    """
    Low-level synchronous HTTP client for the Vangrex API.
    """

    def __init__(
        self,
        api_key: str,
        *,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30.0,
    ) -> None:
        if not isinstance(api_key, str) or not api_key.strip():
            raise ValueError("api_key must be a non-empty string")

        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

        self._http = httpx.Client(
            base_url=self.base_url,
            timeout=timeout,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )

    def request(
        self,
        method: str,
        path: str,
        *,
        json: Any = None,
        headers: dict[str, str] | None = None,
    ) -> Any:
        response = self._http.request(
            method,
            path,
            json=json,
            headers=headers,
        )

        return self._handle_response(response)

    def get(
        self,
        path: str,
        *,
        headers: dict[str, str] | None = None,
    ) -> Any:
        return self.request("GET", path, headers=headers)

    def post(
        self,
        path: str,
        *,
        json: Any = None,
        headers: dict[str, str] | None = None,
    ) -> Any:
        return self.request("POST", path, json=json, headers=headers)

    def stream(
        self,
        path: str,
        *,
        headers: dict[str, str] | None = None,
    ) -> Iterator[str]:
        stream_headers = {
            "Accept": "text/event-stream",
            **(headers or {}),
        }

        with self._http.stream(
            "GET",
            path,
            headers=stream_headers,
        ) as response:
            self._raise_for_status(response)

            yield from response.iter_lines()

    @staticmethod
    def _raise_for_status(response: httpx.Response) -> None:
        if response.is_success:
            return

        body: Any = None

        try:
            body = response.json()
        except ValueError:
            body = response.text

        message = (
            body.get("error")
            if isinstance(body, dict) and isinstance(body.get("error"), str)
            else f"Request failed with status {response.status_code}"
        )

        raise VangrexError(
            message,
            status=response.status_code,
            body=body,
        )

    @classmethod
    def _handle_response(cls, response: httpx.Response) -> Any:
        cls._raise_for_status(response)

        if not response.content:
            return None

        try:
            return response.json()
        except ValueError as exc:
            raise VangrexError(
                "Vangrex API returned an invalid JSON response",
                status=response.status_code,
                body=response.text,
            ) from exc

    def close(self) -> None:
        self._http.close()

    def __enter__(self) -> VangrexClient:
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()


class AsyncVangrexClient:
    """
    Low-level asynchronous HTTP client for the Vangrex API.
    """

    def __init__(
        self,
        api_key: str,
        *,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30.0,
    ) -> None:
        if not isinstance(api_key, str) or not api_key.strip():
            raise ValueError("api_key must be a non-empty string")

        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

        self._http = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=timeout,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )

    async def request(
        self,
        method: str,
        path: str,
        *,
        json: Any = None,
        headers: dict[str, str] | None = None,
    ) -> Any:
        response = await self._http.request(
            method,
            path,
            json=json,
            headers=headers,
        )

        return await self._handle_response(response)

    async def get(
        self,
        path: str,
        *,
        headers: dict[str, str] | None = None,
    ) -> Any:
        return await self.request("GET", path, headers=headers)

    async def post(
        self,
        path: str,
        *,
        json: Any = None,
        headers: dict[str, str] | None = None,
    ) -> Any:
        return await self.request("POST", path, json=json, headers=headers)

    async def stream(
        self,
        path: str,
        *,
        headers: dict[str, str] | None = None,
    ) -> AsyncIterator[str]:
        stream_headers = {
            "Accept": "text/event-stream",
            **(headers or {}),
        }

        async with self._http.stream(
            "GET",
            path,
            headers=stream_headers,
        ) as response:
            self._raise_for_status(response)

            async for line in response.aiter_lines():
                yield line

    @staticmethod
    def _raise_for_status(response: httpx.Response) -> None:
        if response.is_success:
            return

        body: Any = None

        try:
            body = response.json()
        except ValueError:
            body = response.text

        message = (
            body.get("error")
            if isinstance(body, dict) and isinstance(body.get("error"), str)
            else f"Request failed with status {response.status_code}"
        )

        raise VangrexError(
            message,
            status=response.status_code,
            body=body,
        )

    @classmethod
    async def _handle_response(cls, response: httpx.Response) -> Any:
        cls._raise_for_status(response)

        if not response.content:
            return None

        try:
            return response.json()
        except ValueError as exc:
            raise VangrexError(
                "Vangrex API returned an invalid JSON response",
                status=response.status_code,
                body=response.text,
            ) from exc

    async def close(self) -> None:
        await self._http.aclose()

    async def __aenter__(self) -> AsyncVangrexClient:
        return self

    async def __aexit__(self, *args: Any) -> None:
        await self.close()