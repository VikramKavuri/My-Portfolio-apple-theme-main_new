import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional

from rag_service import RES_INDEXES, top_keywords, score_against_resume, embed_single
from gen import reasons_reply

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Portfolio Matcher API")

# CORS - use environment variable with fallback
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "https://my-portfolio-apple-theme-mainnew.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    job_description: str

class SkillMatch(BaseModel):
    skill: str
    usage: str

class ResumeMatch(BaseModel):
    resume_name: str
    match_score: float
    reasons: str
    top_skills: List[SkillMatch]

class MatchResponse(BaseModel):
    success: bool
    best_match: Optional[ResumeMatch]
    all_matches: Dict[str, Any]
    error: Optional[str] = None

@app.get("/healthz")
def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "resumes_loaded": len(RES_INDEXES),
        "resume_names": [idx.name for idx in RES_INDEXES]
    }

@app.post("/match", response_model=MatchResponse)
def match(req: MatchRequest):
    """
    Match job description against resumes and return best fit with reasons
    """
    try:
        jd = (req.job_description or "").strip()
        
        # Validation
        if not jd:
            return MatchResponse(
                success=False,
                best_match=None,
                all_matches={},
                error="Job description cannot be empty"
            )
        
        if len(jd) < 50:
            return MatchResponse(
                success=False,
                best_match=None,
                all_matches={},
                error="Job description too short. Please provide at least 50 characters."
            )
        
        # Check if resumes are loaded
        if not RES_INDEXES:
            logger.error("No resumes loaded in the system")
            raise HTTPException(status_code=500, detail="No resumes available")
        
        logger.info(f"Processing job description ({len(jd)} chars) against {len(RES_INDEXES)} resumes")
        
        # Extract keywords
        keywords = top_keywords(jd, n=10)
        logger.info(f"Extracted keywords: {keywords}")
        
        # Embed the job description
        jd_vec = embed_single(jd)
        
        # Score all resumes
        all_results = {}
        best_score = 0
        best_resume = None
        
        for idx in RES_INDEXES:
            try:
                score, top_pairs = score_against_resume(jd_vec, idx, top_k=6)
                retrieved_chunks = [chunk for (chunk, sim) in top_pairs][:6]
                
                # Generate reasons using LLM
                reasons = reasons_reply(jd, keywords, retrieved_chunks)
                
                all_results[idx.name] = {
                    "score": round(score, 1),
                    "reasons": reasons,
                    "top_chunks": retrieved_chunks[:3]  # Store top 3 for reference
                }
                
                # Track best match
                if score > best_score:
                    best_score = score
                    best_resume = idx.name
                    
            except Exception as e:
                logger.error(f"Error processing resume {idx.name}: {str(e)}")
                all_results[idx.name] = {
                    "score": 0,
                    "reasons": f"Error processing this resume: {str(e)}",
                    "top_chunks": []
                }
        
        # Build best match response
        if best_resume and best_resume in all_results:
            best_data = all_results[best_resume]
            
            # Extract skill matches from the reasons (simplified approach)
            skill_matches = []
            for kw in keywords[:10]:
                # Find if keyword appears in any retrieved chunk
                usage = "Skill mentioned in resume"
                for chunk in best_data.get("top_chunks", [])[:3]:
                    if kw.lower() in chunk.lower():
                        # Extract context around the keyword (max 150 chars)
                        idx_pos = chunk.lower().find(kw.lower())
                        start = max(0, idx_pos - 50)
                        end = min(len(chunk), idx_pos + 100)
                        usage = chunk[start:end].strip() + "..."
                        break
                
                skill_matches.append(SkillMatch(skill=kw, usage=usage))
            
            best_match_obj = ResumeMatch(
                resume_name=best_resume,
                match_score=round(best_data["score"], 1),
                reasons=best_data["reasons"],
                top_skills=skill_matches
            )
        else:
            best_match_obj = None
        
        logger.info(f"Best match: {best_resume} with score {best_score}")
        
        return MatchResponse(
            success=True,
            best_match=best_match_obj,
            all_matches=all_results,
            error=None
        )
        
    except Exception as e:
        logger.error(f"Error in match endpoint: {str(e)}", exc_info=True)
        return MatchResponse(
            success=False,
            best_match=None,
            all_matches={},
            error=f"Internal server error: {str(e)}"
        )

@app.get("/")
def root():
    return {
        "message": "Portfolio Matcher API",
        "endpoints": {
            "health": "/healthz",
            "match": "/match (POST)"
        }
    }