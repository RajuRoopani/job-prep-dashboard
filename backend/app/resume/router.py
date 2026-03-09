from __future__ import annotations
import io
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.resume.service import analyze_resume, generate_personalized_prep
from app.prep.models import ContentType

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
