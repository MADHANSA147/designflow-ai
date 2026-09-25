from langgraph.graph import StateGraph, END
from app.schemas.state import ProjectState

def create_base_graph(
    name: str,
    validate_input_node,
    retrieve_context_node,
    execute_agent_node,
    validate_output_node,
    persist_result_node
):
    """
    Factory to create a standard graph following the pipeline:
    validate input -> retrieve context -> execute agent -> validate output -> persist result
    """
    workflow = StateGraph(ProjectState)
    
    # Add nodes
    workflow.add_node("validate_input", validate_input_node)
    workflow.add_node("retrieve_context", retrieve_context_node)
    workflow.add_node("execute_agent", execute_agent_node)
    workflow.add_node("validate_output", validate_output_node)
    workflow.add_node("persist_result", persist_result_node)
    
    # Edge logic for retries
    def check_errors(state: ProjectState):
        if state.get("errors") and len(state["errors"]) > 0:
            return "error"
        return "success"
    
    # Simple linear flow
    workflow.set_entry_point("validate_input")
    workflow.add_edge("validate_input", "retrieve_context")
    workflow.add_edge("retrieve_context", "execute_agent")
    workflow.add_edge("execute_agent", "validate_output")
    
    # We can use a conditional edge if output is invalid to retry agent
    workflow.add_conditional_edges(
        "validate_output",
        check_errors,
        {
            "success": "persist_result",
            "error": "execute_agent" # Retry
        }
    )
    
    workflow.add_edge("persist_result", END)
    
    return workflow.compile()
