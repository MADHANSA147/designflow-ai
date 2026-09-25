from typing import TypedDict, Any, Dict, List, Optional
from langgraph.graph import StateGraph

class ProjectState(TypedDict):
    project: Optional[Dict[str, Any]]
    productBrief: Optional[Dict[str, Any]]
    uxPlan: Optional[Dict[str, Any]]
    designSystem: Optional[Dict[str, Any]]
    designMemory: Optional[Dict[str, Any]]
    currentScreen: Optional[Dict[str, Any]]
    components: Optional[List[Dict[str, Any]]]
    userRequest: Optional[str]
    generationContext: Optional[Dict[str, Any]]
    reviewFindings: Optional[List[Dict[str, Any]]]
    
    # Internal routing & errors
    errors: Optional[List[str]]
    current_step: Optional[str]
