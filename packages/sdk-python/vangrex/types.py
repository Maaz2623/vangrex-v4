from dataclasses import dataclass
from typing import Any, Literal

ExecutionStatus = Literal[
    "pending",
    "running",
    "success",
    "error",
    "cancelled",
]

ExecutionEventType = Literal[
    "execution.started",
    "node.started",
    "node.output",
    "node.completed",
    "node.failed",
    "execution.completed",
    "execution.failed",
]


@dataclass(frozen=True)
class RunWorkflowResponse:
    execution_id: str
    status: str


@dataclass(frozen=True)
class Execution:
    id: str
    workflow_id: str
    status: ExecutionStatus
    input: Any
    output: Any
    error: Any
    started_at: str | None
    completed_at: str | None
    created_at: str


@dataclass(frozen=True)
class ExecutionEventData:
    node_id: str | None = None
    status: str | None = None
    output: Any = None
    error: Any = None


@dataclass(frozen=True)
class ExecutionEvent:
    id: str
    execution_id: str
    workflow_id: str
    type: ExecutionEventType
    timestamp: str
    data: ExecutionEventData