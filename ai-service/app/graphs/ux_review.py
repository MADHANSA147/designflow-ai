from typing import Any
from app.schemas.state import ProjectState
from .base import create_base_graph

def validate_input_node(state: ProjectState):
    if not state.get("currentScreen"):
        state["errors"] = ["Missing screen for review"]
    return state

def retrieve_context_node(state: ProjectState):
    return state

def execute_agent_node(state: ProjectState):
    state["reviewFindings"] = [
        {"severity": "WARNING", "problem": "Low contrast", "elementId": "btn1"}
    ]
    state["errors"] = []
    return state

def validate_output_node(state: ProjectState):
    if state.get("reviewFindings") is None:
        state["errors"] = ["Review findings not generated"]
    return state

def persist_result_node(state: ProjectState):
    state["current_step"] = "ux_review_complete"
    return state

ux_review_graph = create_base_graph(
    "ux_review",
    validate_input_node,
    retrieve_context_node,
    execute_agent_node,
    validate_output_node,
    persist_result_node
)
