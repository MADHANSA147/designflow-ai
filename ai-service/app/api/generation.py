from fastapi import APIRouter, HTTPException
from app.schemas.generation import GenerationRequest, GenerationResponse
from app.graphs.product_generation import product_generation_graph
from app.graphs.screen_generation import screen_generation_graph
from app.graphs.ux_review import ux_review_graph

router = APIRouter()

@router.post("/product", response_model=GenerationResponse)
async def generate_product(req: GenerationRequest):
    initial_state = {
        "userRequest": req.prompt,
        "generationContext": req.context,
        "errors": []
    }
    
    # LangGraph execution
    final_state = product_generation_graph.invoke(initial_state)
    
    if final_state.get("errors"):
        raise HTTPException(status_code=400, detail=final_state["errors"])
        
    return GenerationResponse(status="success", data={"productBrief": final_state.get("productBrief")})

@router.post("/screen", response_model=GenerationResponse)
async def generate_screen(req: GenerationRequest):
    initial_state = {
        "userRequest": req.prompt,
        "designSystem": req.context.get("designSystem") if req.context else None,
        "errors": []
    }
    
    final_state = screen_generation_graph.invoke(initial_state)
    
    if final_state.get("errors"):
        raise HTTPException(status_code=400, detail=final_state["errors"])
        
    return GenerationResponse(status="success", data={"screen": final_state.get("currentScreen")})
