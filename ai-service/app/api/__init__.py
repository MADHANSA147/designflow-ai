from fastapi import APIRouter

router = APIRouter()

from .generation import router as gen_router
router.include_router(gen_router, prefix="/generate")
