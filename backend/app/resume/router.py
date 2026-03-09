from __future__ import annotations
import io
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.resume.service import analyze_resume, generate_personalized_prep
from app.prep.models import ContentType
from app.database import get_db

router = APIRouter(tags=["resume"])


class ResumeRequest(BaseModel):
    resume_text: str


class PersonalizedPrepRequest(BaseModel):
    resume_text: str


@router.post("/resume/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    content = await file.read()
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(content))
        pages_text = []
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                pages_text.append(extracted)
        text = "\n".join(pages_text).strip()
        if not text:
            raise HTTPException(
                status_code=422,
                detail="Unable to extract text from this PDF. The file may be image-based or encrypted. Please paste your resume as plain text instead.",
            )
        return {"text": text}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Unable to parse resume content. The provided file appears to be corrupted or improperly encoded. Please paste your resume as plain text instead.",
        )


@router.post("/resume/analyze")
async def analyze(body: ResumeRequest):
    if not body.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text is required")
    try:
        return await analyze_resume(body.resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}")


@router.get("/resume/analyses")
async def list_analyses(limit: int = 20, offset: int = 0):
    """Return stored resume analyses, most recent first."""
    async with get_db() as conn:
        rows = await conn.fetch(
            """
            SELECT id, candidate_name, candidate_level, profile, matches,
                   analyzed_at, length(resume_text) AS resume_length
            FROM resume_analyses
            ORDER BY analyzed_at DESC
            LIMIT $1 OFFSET $2
            """,
            min(limit, 100),
            offset,
        )
        total = await conn.fetchval("SELECT COUNT(*) FROM resume_analyses")
    return {
        "total": total,
        "items": [
            {
                "id": r["id"],
                "candidate_name": r["candidate_name"],
                "candidate_level": r["candidate_level"],
                "profile": r["profile"],
                "matches": r["matches"],
                "analyzed_at": r["analyzed_at"].isoformat(),
                "resume_length": r["resume_length"],
            }
            for r in rows
        ],
    }


@router.get("/resume/analyses/{analysis_id}")
async def get_analysis(analysis_id: int):
    """Return a single stored resume analysis including the original resume text."""
    async with get_db() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM resume_analyses WHERE id = $1",
            analysis_id,
        )
    if not row:
        raise HTTPException(status_code=404, detail=f"Analysis {analysis_id} not found")
    return {
        "id": row["id"],
        "candidate_name": row["candidate_name"],
        "candidate_level": row["candidate_level"],
        "resume_text": row["resume_text"],
        "profile": row["profile"],
        "matches": row["matches"],
        "analyzed_at": row["analyzed_at"].isoformat(),
    }


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
