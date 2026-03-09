from __future__ import annotations
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.resume.service import analyze_resume, generate_personalized_prep
from app.prep.models import ContentType

router = APIRouter(tags=["resume"])


class ResumeRequest(BaseModel):
    resume_text: str


class PersonalizedPrepRequest(BaseModel):
    resume_text: str


@router.post("/resume/analyze")
async def analyze(body: ResumeRequest):
    if not body.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text is required")
    try:
        return await analyze_resume(body.resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}")


@router.post("/jobs/{job_id}/prep/{content_type}/personalized")
async def personalized_prep(job_id: int, content_type: ContentType, body: PersonalizedPrepRequest):
    if not body.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text is required")
    try:
        return await generate_personalized_prep(job_id, content_type.value, body.resume_text)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prep generation failed: {e}")
