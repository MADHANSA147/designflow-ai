from typing import Any
from app.schemas.state import ProjectState
from .base import create_base_graph
from app.services.consistency import check_consistency

def validate_input_node(state: ProjectState):
    if not state.get("designSystem"):
        state["errors"] = ["Missing Design System in context"]
    return state

def retrieve_context_node(state: ProjectState):
    # Fetch global components and UX rules
    if not state.get("components"):
        state["components"] = []
    return state

def execute_agent_node(state: ProjectState):
    # Simulate LLM returning UI Schema
    # In reality, this relies on previous messages and consistency warnings if any exist
    state["currentScreen"] = {
        "id": "screen_123",
        "name": "Generated Dashboard",
        "componentTree": {"type": "Container", "children": []}
    }
    # Clear errors on successful execution
    state["errors"] = []
    return state

def validate_output_node(state: ProjectState):
    screen = state.get("currentScreen")
    if not screen or "componentTree" not in screen:
        state["errors"] = ["Invalid UI schema generated"]
        return state
        
    # RUN CONSISTENCY ENGINE
    warnings = check_consistency(
        screen["componentTree"], 
        state.get("designSystem", {}), 
        state.get("components", [])
    )
    
    if warnings:
        # Pushing warnings as errors to force LangGraph conditional edge to retry
        state["errors"] = warnings
        
    return state

def persist_result_node(state: ProjectState):
    state["current_step"] = "screen_generation_complete"
    return state

screen_generation_graph = create_base_graph(
    "screen_generation",
    validate_input_node,
    retrieve_context_node,
    execute_agent_node,
    validate_output_node,
    persist_result_node
)
