from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class GenerationRequest(BaseModel):
    project_id: str
    prompt: str
    context: Optional[Dict[str, Any]] = None

class GenerationResponse(BaseModel):
    status: str
    data: Dict[str, Any]
