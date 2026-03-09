import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.research.service import get_or_generate_research

logger = logging.getLogger(__name__)
router = APIRouter(tags=["research"])


class ResearchRequest(BaseModel):
    company_name: str
    role_hint: str = ""


@router.post("/research/company")
async def research_company(body: ResearchRequest):
    name = body.company_name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="company_name is required")
    if len(name) > 200:
        raise HTTPException(status_code=400, detail="company_name too long")
    try:
        return await get_or_generate_research(name, body.role_hint.strip())
    except Exception as e:
        logger.exception("Company research failed for %s", name)
        raise HTTPException(status_code=500, detail=f"Research generation failed: {e}")
