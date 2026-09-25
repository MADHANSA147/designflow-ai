from typing import Any
from app.schemas.state import ProjectState
from .base import create_base_graph

def validate_input_node(state: ProjectState):
    if not state.get("userRequest"):
        state["errors"] = ["Missing user request"]
    return state

def retrieve_context_node(state: ProjectState):
    # Simulated RAG or DB fetch
    if not state.get("generationContext"):
        state["generationContext"] = {"info": "Market research data"}
    return state

def execute_agent_node(state: ProjectState):
    # Simulated LLM call using langchain
    state["productBrief"] = {
        "title": "Generated Product Brief",
        "details": f"Based on {state.get('userRequest')}"
    }
    # Clear errors on retry
    state["errors"] = []
    return state

def validate_output_node(state: ProjectState):
    brief = state.get("productBrief")
    if not brief or not brief.get("title"):
        state["errors"] = ["Invalid output format"]
    return state

def persist_result_node(state: ProjectState):
    # Would emit to queue or save to DB
    state["current_step"] = "product_generation_complete"
    return state

product_generation_graph = create_base_graph(
    "product_generation",
    validate_input_node,
    retrieve_context_node,
    execute_agent_node,
    validate_output_node,
    persist_result_node
)
